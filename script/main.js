//let saveButton = document.getElementById("save-button");
const APIUrl = 'http://localhost:3000'
let form = document.getElementById('form-notebook-identifier');

form.onsubmit = async function(event){
    event.preventDefault();
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    console.log("The content of the titlefield is:  " + titleField)
    console.log("The content of the text-area is: " + textAreaField)

    const response = await fetch(`${APIUrl}/submit` , {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: titleField, description: textAreaField})
    });

    if(!response.ok){
        throw new Error('There is a problem.');
    }

    const result = await response.json();
    console.log(result.message);


};

