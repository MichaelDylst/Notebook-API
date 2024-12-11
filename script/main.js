import * as Modules from "../modules/module.js";

const APIUrl = 'http://localhost:3000';
let form = document.getElementById('form-notebook-identifier');
let tBody = document.getElementById('table-body');
let dataMode = false;
let selectedNoteId = null;
let folder_id = null;
let createNoteButton = document.getElementById('create-note-button');
let tableNotes = document.getElementById('table-notebook');

Modules.backToFolderPage(Modules.backToFolderButton);
Modules.logout();
Modules.toggleDropdown();
Modules.setupAddFolderForm(Modules.addFolderForm, Modules.createFolder);
Modules.handleAddToFolder();

form.onsubmit = async function(event){
    event.preventDefault();

    const value = event.submitter.value;
    if(value ==="Cancel"){
        Modules.closeModal();
    }else if(value ==="Save"){
        if(dataMode){
            await updateNote();
            Modules.closeModal();
            await Modules.refreshAllNotes();
            location.reload();
        }else{
            await createNote()
            await Modules.refreshAllNotes();
            location.reload();
        }
    }
};

async function showNotebook(){
    let storedNotes = sessionStorage.getItem('folderNotes');
    const notesArray = JSON.parse(storedNotes);
    const options = await Modules.createOptionsSelectedFolders();
    notesArray.forEach(note => {
        if(notesArray.length > 0){
            tBody.innerHTML += 
            `
            <tr class="notebook-single-tr" data-id="${note.id}" data-folder-id=${note.folder_id}>
              <div class="notebook-single-element" id="notebook-single-container">  
                    <td class="title-container">${note.title}</td>
                    <td class="description-container">${note.description}</td>
                    <td class="actions">
                        <i title="Edit"  class="fas fa-edit"></i>
                        <i title="Delete"  class="fas fa-trash-alt"></i>
                       
                        <div id="dropdown">
                            <i title="Dropdown"  class="fa-solid fa-ellipsis"></i>
                            <div id="myDropdown" class="dropdown-content">
                            <a id="add-to-folder-button" class="add-to-folder "href="#">Add to folder</a>
                            <select id="folder-select" class="folder-select-container" data-note-id="${note.id}">
                                ${options.join('')}
                            </select>
                                <a class="like-this-note" href="#">Like this note</a>
                        
                        </div>
                    </td>
                </div>
             </tr>
 
             ` 
        }
    })};

document.getElementById('table-body').addEventListener('click', async function (event) {

    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");
    if(event.target.classList.contains('fa-trash-alt')){
                event.stopPropagation();
                const noteContainer = event.target.closest('.notebook-single-tr');
                const noteId = noteContainer.attributes["data-id"].value;``

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
                    await Modules.refreshAllNotes();
                    alert("Note deleted successfully");
                    
                }
                catch(error){
                    console.error(error)
                    alert("There was an error. Please try again.", error)
                }}

    else if(event.target.classList.contains('fa-edit')){

        Modules.openModal();
        dataMode = true;
        event.stopPropagation();
        const noteContainer = event.target.closest('.notebook-single-tr');
        selectedNoteId = noteContainer.attributes["data-id"].value;
        folder_id = noteContainer.attributes["data-folder-id"].value;
        const title = noteContainer.querySelector('.title-container').textContent;
        const description = noteContainer.querySelector('.description-container').textContent;

        titleField.value = title;
        textAreaField.value = description;
    }else if(event.target.classList.contains('fa-ellipsis')){
        event.stopPropagation();
        const noteRow = event.target.closest('.notebook-single-tr');
        const dropdownContent = noteRow.querySelector('.dropdown-content');
        if(dropdownContent){
            if(dropdownContent.style.display === ""){
                dropdownContent.style.display ="block";
            }else{
                dropdownContent.style.display ="";
            }
        }
    }
    });


async function updateNote(){
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    try{const response = await fetch(`${APIUrl}/update`, {
        method:'PATCH', 
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id: selectedNoteId, title: titleField, description: textAreaField})
    })
        const result = await response.json();
        alert(result.message)
    }catch(error){
        console.error(error)
    }
}

async function createNote(){
    dataMode = false;
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;
    const user = Modules.decodeJWT();
    const account_id = user.account_id;
    
    try{
        const response = await fetch(`${APIUrl}/submit` , {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: titleField, description: textAreaField, account_id:account_id})
    })  
        const result = await response.json();
        alert(result.message)
        Modules.closeModal();
}catch(error){
            alert("There was an error. Please try again.")
            console.error(error);
    }
}



createNoteButton.addEventListener('click', (event) => {
    dataMode = false;
    Modules.openModal();
});

window.onload = async function () {
    const token = sessionStorage.getItem('validationToken');
    if(!token){
        alert("You're not logged in, please log in.")
        window.location.href="login.html";
    }
    await showNotebook();
}
