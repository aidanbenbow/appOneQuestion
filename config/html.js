export function createFormHtml(form) {
    return `<form action="${form.action}" method="${form.method}">
        ${form.fields.map(field => {
            return `<label for="${field.name}" class="form-label">${field.label}</label>
                    <input type="${field.type}" class="form-control" name="${field.name}" id="${field.name}" ${field.required ? 'required' : ''}>
                    <br>`;
        }).join('')}
        <div class="text-center">
        <button type="submit" class="btn btn-primary">${form.submitText}</button>
        </div>
    </form>`;
}

export function createResultsHtml(results) {
    if (!results || results.length === 0) {
        return '<p>No results found.</p>';
    }
    
    return `<table class="table table-striped">
        <thead>
            <tr>
               
                <th>Intrebare</th>
                <th>De ce?</th>
            </tr>
        </thead>
        <tbody>
            ${results.map(result => {
                return `<tr>
                   
                    <td>${result.question1}</td>
                    <td>${result.question2}</td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>`;
}