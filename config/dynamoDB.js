import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';
dotenv.config();

export class DynamoDBService{
    constructor(tableName) {
        this.client = new DynamoDBClient({
            region: 'eu-central-1', 
            //  credentials: {
            //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            // }

        });
        this.documentClient = DynamoDBDocumentClient.from(this.client);
        this.tableName = tableName;
    }
    async putItem(item) {
        const params = {
            TableName: this.tableName,
            Item: item
        };
        try {
            const command = new PutCommand(params);
            const result = await this.documentClient.send(command);
            return result;
        } catch (error) {
            console.error("Error putting item in DynamoDB:", error);
            throw error;
        }
    }

    async getAllItems() {
        const params = {
            TableName: this.tableName
        };
        try {
            const command = new ScanCommand(params);
            const result = await this.documentClient.send(command);
            return result.Items;
        } catch (error) {
            console.error("Error scanning DynamoDB:", error);
            throw error;
        }
    }
}