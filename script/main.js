const APIUrl = 'http://localhost:3000'
let form = document.getElementById('form-notebook-identifier');
let tBody = document.getElementById('table-body');
let dataMode = false;
let selectedNoteId = null;

form.onsubmit = async function(event){
    event.preventDefault();

    if(dataMode){
        await updateNote()
    }else{
        await createNote()
    }
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

    notebook.forEach(note => {
        const limitedDescription = note.description.length > 100
        ? note.description.slice(0,30) + "..."
        : note.description;

        tBody.innerHTML += 
        `
        <tr class="notebook-single-tr">
            <div class="notebook-single-element" data-id="${note.id}">
                <td class="title-container">${note.title}</td>
                <td class="description-container">${note.description}</td>
                <td class="actions">
                    <i onClick="fetchNote(this)" class="fas fa-edit"></i>
                    <i onClick="deleteNote(this)" class="fas fa-trash-alt"></i>
                </td>
            </div>
        </tr>
        `

    })};

async function deleteNote(){
    const tBodyContainer = document.getElementById('table-body');

        tBodyContainer.addEventListener('click', async function (event) {
            if(event.target.classList.contains('fa-trash-alt')){
                event.stopPropagation();
                const noteContainer = event.target.closest('.notebook-single-tr');
                const noteId = noteContainer.nextElementSibling.getAttribute('data-id');

                try{
                    const response = await fetch(`${APIUrl}/delete`,{
                    method: 'DELETE',
                    headers: {
                        'Content-type':'application/json'
                    },
                    body: JSON.stringify({id:noteId})
                    
                })
                    const result = await response.json();
                    noteContainer.remove()
                    alert("Note deleted sucessfully")
                }
                catch(error){
                    console.error(error)
                    alert("There was an error. Please try again.", error)
                }}

            });
}

async function editNote(){
    dataMode = True;
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");
    
    const allNotesContainer = document.getElementById('notebook-entries');

    allNotesContainer.addEventListener('click', function(event){
        if(event.target.classList.contains("fa-edit")){
            event.stopPropagation();
            const noteContainer = event.target.closest('.notebook-single-container');
            selectedNoteId = noteContainer.firstElementChild.getAttribute('data-id');
            const title = noteContainer.querySelector('.title-container').textContent;
            const description = noteContainer.querySelector('.entry').textContent;
            
            titleField.value = title;
            textAreaField.value = description;
        }
    }, {once:true});

};


async function updateNote(){
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    const response = await fetch(`${APIUrl}/update`, {
        method:'PATCH', 
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id: selectedNoteId, title: titleField, description: textAreaField})
    })
    if (!response.ok) {
    throw new Error(response.message);
    }

    const result = await response.json();

    location.reload()
}

function fetchNote(){
    dataMode = true;
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");
    
    const tBodyContainer = document.getElementById('table-body');

    tBodyContainer.addEventListener('click', function(event){
        if(event.target.classList.contains("fa-edit")){
            event.stopPropagation();
            const noteContainer = event.target.closest('.notebook-single-tr');
            selectedNoteId = noteContainer.nextElementSibling.getAttribute('data-id');
            const title = noteContainer.querySelector('.title-container').textContent;
            const description = noteContainer.querySelector('.description-container').textContent;
            
            titleField.value = title;
            textAreaField.value = description;
        }
    }, {once:true});

};

async function createNote(){
    dataMode = false;
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;
    
    try{
        const response = await fetch(`${APIUrl}/submit` , {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: titleField, description: textAreaField})
    })}catch(error){
            alert("There was an error. Please try again.")
            console.error(error);
    }
    const result = await response.json();
    textAreaField.value = "";
    titleField.value = "";
    location.reload();
}



document.addEventListener('DOMContentLoaded', () =>{
    showNotebook();
})
