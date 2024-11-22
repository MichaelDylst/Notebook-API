const form = document.getElementById('form-notebook-identifier');
const APIUrl = 'http://localhost:3000'


form.onsubmit = async function(event){
    event.preventDefault();

    let titleField = document.getElementById('title-field').value;
    let textAreaField = document.getElementById('text-area-field').value;

    console.log("titlefield: " + titleField);
    console.log("description-field: " + textAreaField);
    
    const response = await fetch(`${APIUrl}/submit`, {
        method:'POST', 
        headers: {
            "Content-type" : 'application/json'
        }, 
        body: JSON.stringify({title: titleField, description: textAreaField})
    });

    const result = await response.json();
    console.log(result.message)
};