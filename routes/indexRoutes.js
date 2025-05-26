import express from 'express';
const router = express.Router();

import {v4 as uuidv4} from 'uuid';
import { createFormHtml, createResultsHtml } from '../config/html.js';

import {DynamoDBService} from '../config/dynamoDB.js'; // Import your DynamoDB service
const dynamoDB = new DynamoDBService('onequestion'); // Initialize DynamoDB with your table nam

router.get('/', (req, res) => {
    // Example form data
    const form = {
        action: '/onequestionApp/submit',
        method: 'POST',
        fields: [
            { name: 'question1', type: 'text', 
            label: 'Dacă ai putea să-I pui lui Dumnezeu o singură întrebare, care ar fi aceea? / Если бы вы могли задать Богу один вопрос, какой бы он был?'
            , required: true },
            { name: 'question2', type: 'text', 
            label: 'De ce?/ Почему?', required: true }
        ],
        submitText: 'trimite'
    };
    // Generate HTML for the form
    const formHtml = createFormHtml(form);
    res.render('index', { title: 'Home', message: 'One Question', formHtml: formHtml });
});

router.get('/results', async (req, res) => {
    // Fetch results from DynamoDB
    let results;
    try {
        results = await dynamoDB.getAllItems();
       const resultsTable = results.map(result => {
            return {
                id: result.id,
                question1: result.question1,
                question2: result.question2
            };
        });
        const resultsHtml = createResultsHtml(resultsTable);
        res.render('results', { title: 'Results', resultsHtml: resultsHtml });
    } catch (error) {
        console.error("Error fetching results from DynamoDB:", error);
        return res.status(500).send('Error fetching results. Please try again later.');
    }
    
    
});

router.post('/submit', async (req, res) => {
    // Handle form submission
    const answers = {
        question1: req.body.question1,
        question2: req.body.question2
    };
    
    // Save the answers to DynamoDB
    try {
        await dynamoDB.putItem({
            id: uuidv4(), // Unique ID for the item
            ...answers
        });
    } catch (error) {
        console.error("Error saving to DynamoDB:", error);
        return res.status(500).send('Error saving your answers. Please try again later.');
    }
    
    // Redirect or render a response
    res.render('thankyou', { title: 'Thank You', message: 'Raspunsul a fost salvat!' });
});

export default router;