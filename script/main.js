const APIUrl = 'http://localhost:3000'
let form = document.getElementById('form-notebook-identifier');
let notesContainer = document.getElementById('notebook-entries');
let readButton = document.getElementById('read-button')
const dataMode = false;

form.onsubmit = async function(event){
    event.preventDefault();
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    if(dataMode = true){
        // execute editNote()
    }else{
        // execute createNote()
    }

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
    location.reload();
};

async function fetchNotebooks(){
    const response = await fetch(`${APIUrl}/notebook`);
    const notebooks = await response.json();
    return notebooks;
}

async function showNotebook(){
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");

    titleField.value = "";
    textAreaField.value = "";
    const notebook = await fetchNotebooks();

    for(let i = 0; i < notebook.length; i++){
        const limitedDescription = notebook[i].description.length > 100
        ? notebook[i].description.slice(0,30) + "..."
        : notebook[i].description;

        notesContainer.innerHTML += 
        `
        <div class="notebook-single-container">
            <div class="title-div" data-id="${notebook[i].id}">
                <h5 class="title-container">${notebook[i].title} </h5>
                
            </div>
            <div class="notebook-entry">
                <p class="entry">${limitedDescription}</p>
            </div>
            <div class="options">
                <span>
                    <i onClick="editNote(this)" class="fas fa-edit"></i>
                    <i onClick="deleteNote(this)" class="fas fa-trash-alt"></i>
                </span>
            </div>
        </div>
      `;    
    }};


async function deleteNote(){
    const deleteButtons = document.querySelectorAll('.fa-trash-alt');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function (event) {
            event.stopPropagation();
            const noteContainer = this.closest('.notebook-single-container');
            const noteId = noteContainer.firstElementChild.getAttribute('data-id');

            const response = await fetch(`${APIUrl}/delete`,{
                method: 'DELETE',
                headers: {
                    'Content-type':'application/json'
                },
                body: JSON.stringify({id:noteId})
            })
            if (!response.ok){
                throw new Error('There is a problem.');
            }
            const result = await response.json();
            location.reload();
        });
    });
}

async function createNote(){
    
}

async function editNote(){
    dataMode = True;
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");
    
    const allNotesContainer = document.getElementById('notebook-entries');

    allNotesContainer.addEventListener('click', async function(event){
        if(event.target.classList.contains("fa-edit")){
            event.stopPropagation();
            console.log("click")
            const noteContainer = event.target.closest('.notebook-single-container');
            const noteId = noteContainer.firstElementChild.getAttribute('data-id');
            const title = noteContainer.querySelector('.title-container').textContent;
            const description = noteContainer.querySelector('.entry').textContent;
            
            titleField.value = title;
            textAreaField.value = description;

            /*const response = await fetch(`${APIUrl}/update`, {
                method:'PATCH', 
                headers: {
                    'Content-type': 'application/json'
                },
        body: JSON.stringify({id: noteId, title: titleField, description: textAreaField})
    })
    if (!response.ok) {
        throw new Error('Failed to update notebook');
    }

    const result = await response.json();
*/

        }
    }, {once:true});
};

document.addEventListener('DOMContentLoaded', () =>{
    showNotebook();
})
