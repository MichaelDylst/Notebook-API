const APIUrl = 'http://localhost:3000';
let form = document.getElementById('form-notebook-identifier');
let tBody = document.getElementById('table-body');
let dataMode = false;
let selectedNoteId = null;
let folder_id = null;
let logoutButton = document.getElementById('logout-button');
let modal = document.getElementById('form-notebook-identifier');
let createNoteButton = document.getElementById('create-note-button');
let closeForm = document.getElementById('cancel-button');
let createFolderButton = document.getElementById('create-folder');
let dropdownContent = document.getElementsByClassName('dropdown-content-menu')[0];
let addFolderButton = document.getElementById('add-folder-button');
let addFolderForm = document.getElementById('add-folder-form');
let addToFolderButton = document.getElementById('add-to-folder-button');
let allNotes = document.getElementById('all-notes-container');
let backToFolderButton = document.getElementById('back-to-folders')

const folderContainer = document.getElementById('folders-notebook');

form.onsubmit = async function(event){
    event.preventDefault();

    const value = event.submitter.value;

    if(value ==="Cancel"){
        closeModal();
    }else if(value ==="Save"){
        if(dataMode){
            console.log("I'm in the right space.")
            await updateNote()
            closeModal();
            location.reload();
        }else{
            await createNote()
        }
    }
};

addFolderForm.onsubmit = async function(event){
    event.preventDefault();
    await createFolder();
}

async function fetchNotebooks(){
    const response = await fetch(`${APIUrl}/notebook`);
    const notebooks = await response.json();
    return notebooks;
}

async function showNotebook(folderID){
    let titleField = document.getElementById("title-field");
    let textAreaField = document.getElementById("text-area-field");
    let tableNotes = document.getElementById('table-notebook');
    let noEntries = document.getElementById('no-notebook-entries');
    let folders = document.getElementById('folders-notebook');
    titleField.value = "";
    textAreaField.value = "";
    const notebook = await fetchNotebooks();
    const user = decodeJWT();
    const account_id = user.account_id;
  
    const options = await showSelectFolders();

    const filteredNotes = folderID
        ? notebook.filter(note => note.account_id === account_id && note.folder_id == folderID)
        : notebook.filter(note => note.account_id === account_id);

    if(filteredNotes.length === 0 ){
        alert("There are no notes in this folder.");
        return;
    }

    Object.values(filteredNotes).forEach(note => {
        if(filteredNotes.length > 0){
            noEntries.style.display = "none";
            folders.style.display = "none"
            tableNotes.style.display = "";
            const limitedDescription = note.description.length > 100
            ? note.description.slice(0,30) + "..."
            : note.description;
    
            tBody.innerHTML += 
            `
            
            <tr class="notebook-single-tr" data-id="${note.id}" data-folder-id=${note.folder_id}>
              <div class="notebook-single-element" id="notebook-single-container">  
                    <td class="title-container">${note.title}</td>
                    <td class="description-container">${note.description}</td>
                    <td class="actions">
                        <i title="Edit" onClick="fetchNote(this)" class="fas fa-edit"></i>
                        <i title="Delete" onClick="deleteNote(this)" class="fas fa-trash-alt"></i>
                       
                        <div id="dropdown">
                            <i title="Dropdown" onClick="showDropdownTable(this)" class="fa-solid fa-ellipsis"></i>
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
        }else{
            alert("There are no notes in this folder.")
        }
    })};

async function deleteNote(){
    const tBodyContainer = document.getElementById('table-body');

        tBodyContainer.addEventListener('click', async function (event) {
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
                    alert("Note deleted sucessfully");
                    location.reload()
                }
                catch(error){
                    console.error(error)
                    alert("There was an error. Please try again.", error)
                }}

            });
}


async function updateNote(){
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    try{const response = await fetch(`${APIUrl}/update`, {
        method:'PATCH', 
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id: selectedNoteId, title: titleField, description: textAreaField, folder_id:folder_id})
    })
        const result = await response.json();
        alert(result.message)
    }catch(error){
        console.error(error)
    }
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
            selectedNoteId = noteContainer.attributes["data-id"].value;
            console.log(selectedNoteId)
            folder_id = noteContainer.attributes["data-folder-id"].value;
            const title = noteContainer.querySelector('.title-container').textContent;
            const description = noteContainer.querySelector('.description-container').textContent;

            titleField.value = title;
            textAreaField.value = description;
            openModal();
        }
    }, {once:true});
    
};

async function createNote(){
    dataMode = false;
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;
    const user = decodeJWT();
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
}catch(error){
            alert("There was an error. Please try again.")
            console.error(error);
    }
    textAreaField.value = "";
    titleField.value = "";
    location.reload();
}

function decodeJWT(){
    const token = sessionStorage.getItem('validationToken');
    if(!token){
        return;
    }

    const base64URL = token.split(".")[1];
    const base64 = base64URL.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
}

function changePage(){
    if(window.location.href === "login.html"){
        window.location.href = "index.html";
    }else{
        window.location.href = "login.html"
    }

}

async function createFolder(){
    let folderName = document.getElementById('folder-name').value;
    let user = decodeJWT();
    let user_id = user.account_id;
    try{
        const response = await fetch(`${APIUrl}/addFolder`, {
            method:'POST', 
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({account_id:user_id, folder_name: folderName} )
        })
        const result = await response.json();
        if(result){
            alert(result.message)
        }
        location.reload();
    }catch(error){
        console.error(error)
    }
}

async function fetchFolders(){
    let user = decodeJWT();
    let user_id = user.account_id;
    try{ 
        const response = await fetch(`${APIUrl}/fetchFolders`, {
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({account_id:user_id})
    })
        const folders = await response.json();
        return folders;
}catch(error){
    console.error(error)
}
}

async function showFolders(){
    const allFolders = await fetchFolders();

    if(allFolders.length > 0){
        let noEntries = document.getElementById('no-notebook-entries');
        let folders = document.getElementById('folders-notebook');
        let tableNotes = document.getElementById('table-notebook');
        noEntries.style.display="none";
        folders.style.display="block";
        tableNotes.style.display="none"

    }

    allFolders.forEach(folder => {
        folderContainer.innerHTML += 
        `
            <div id="single-folder" class="single-folder-container button" data-id="${folder.folder_id}">
                <p>${folder.folder_name}</p>
            </div>
        `
    })
}

async function showSelectFolders(){
    const allFolders = await fetchFolders();
    const folderMap = new Map();
    allFolders.forEach(folder => {
        folderMap.set( folder.folder_id, folder.folder_name);
    })
    const options = Array.from(folderMap.entries()).map(([id, folderName]) => {
        return `<option class="option-folders" value="${id}">${folderName}</option>`;
    });
    return options
}

async function addNoteToFolder(noteId, folderId){
    try{
        const response = await fetch(`${APIUrl}/updateFolder`, {
            method:'PATCH',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify({note_id:noteId, folder_id: folderId})
        })
        const result = await response.json()
        alert(result.message)
    }catch(error){
        console.error(error)
    }
}


function showDropdownTable(){
    const tBodyContainer = document.getElementById('table-body');

    tBodyContainer.addEventListener('click', function(event){
        if(event.target.classList.contains("fa-ellipsis")){
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
    }, {once:true});

};

function openModal () {
    modal.style.display = 'flex';
}

function closeModal(){
    modal.style.display = 'none';
}

createNoteButton.addEventListener('click', (event) => {
    dataMode = false;
    openModal();
});

createFolderButton.addEventListener('click', () => {
    if(dropdownContent.style.display === ""){
        dropdownContent.style.display ="block";
    }else{
        dropdownContent.style.display ="";
    }
})

logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('validationToken');
    changePage();
})

document.addEventListener('click', function(event){
    if (event.target && event.target.id === "add-to-folder-button"){
        event.preventDefault();
        const folderSelect = event.target.closest('.dropdown-content').querySelector('#folder-select');
        const noteId = folderSelect.dataset.noteId;
        const folderId = folderSelect.value;
        addNoteToFolder(noteId, folderId)
    }
})

document.addEventListener('click', function(event){
    if(event.target && event.target.id ==="single-folder"){
        const selectedFolder = event.target.closest(".single-folder-container");
        const folderID = selectedFolder.dataset.id;
        showNotebook(folderID)
    }else if(event.target && event.target.id ==="all-notes-container"){
    }
} )

backToFolderButton.addEventListener('click', function(){
    let folders = document.getElementById('folders-notebook');
    let tableNotes = document.getElementById('table-notebook');
    folders.style.display="block";
    tableNotes.style.display="none"
    location.reload();
})

document.addEventListener('DOMContentLoaded', () =>{
    const token = sessionStorage.getItem('validationToken');
    if(!token){
        alert("You're not logged in, please log in.")
        window.location.href="login.html";
    }
    fetchFolders();
    showFolders();
})
