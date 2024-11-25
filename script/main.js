//let saveButton = document.getElementById("save-button");
const APIUrl = 'http://localhost:3000'
let form = document.getElementById('form-notebook-identifier');
let readButton = document.getElementById('read-button');
let clearButton = document.getElementById('clear-button');

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
    textAreaField.value = "";
    titleField.value = "";
};

async function fetchNotebooks(){
    const response = await fetch(`${APIUrl}/notebook`);
    const notebooks = await response.json();
    return notebooks;
}

async function showNotebook(){
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");

    // reset values 
    titleField.value = "";
    textAreaField.value = "";
    let valueInput = parseInt(document.getElementById('search-input').value);
    //console.log(typeof(valueInput));
    const notebook = await fetchNotebooks();
    //console.log(notebook);

    for(let i = 0; i < notebook.length; i++){
        //console.log(typeof(notebook[i].id));
        //console.log(valueInput)
        if (notebook[i].id === valueInput){
            let titleValue = notebook[i].title;
            let descriptionValue = notebook[i].description;
            titleField.value = titleValue;
            textAreaField.value = descriptionValue;
            return;
        }
    }
    textAreaField.value = "Sorry there is no entry for this ID, please select again."
}

const clearData = () => {
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");
    console.log(titleField.value);
    console.log(textAreaField.value);

    titleField.value = "";
    textAreaField.value = "";

};

readButton.onclick = () => {
    showNotebook();
}

clearButton.onclick = () => {
    clearData();
}

