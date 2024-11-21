//let saveButton = document.getElementById("save-button");
const APIUrl = 'http://localhost:3000'
let form = document.getElementById('form-notebook-identifier');

form.onsubmit = async function(event){
    event.preventDefault();
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    console.log("De inhoud van het title-field is: " + titleField)
    console.log("De inhoud van het text-area-field is: " + textAreaField)

    const response = await fetch(`${APIUrl}/submit` , {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: titleField, description: textAreaField})
    });

    if(!response.ok){
        throw new Error('Er is een probleem met het verzenden van de data');
    }

    const result = await response.json();
    console.log(result.message);


};

