let modal = document.getElementById('form-notebook-identifier');
let addFolderForm = document.getElementById('add-folder-form');
let backToFolderButton = document.getElementById('back-to-folders')
const APIUrl = 'http://localhost:3000';

function openModal () {
    modal.style.display = 'flex';
}

function closeModal(){
    modal.style.display = 'none';
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

function setupAddFolderForm(addFolderForm, createFolder){
    addFolderForm.onsubmit = async function(event){
    event.preventDefault();
    await createFolder();
    }
}

async function fetchNotebooks(){
    const response = await fetch(`${APIUrl}/notebook`);
    const notebooks = await response.json();
    return notebooks;
}

function backToFolderPage(backToFolderButton)
{backToFolderButton.addEventListener('click', function(){
    sessionStorage.removeItem('folderNotes')
    window.location.href="folder.html"
});}


function toggleDropdown(){
    let createFolderButton = document.getElementById('create-folder');
    let dropdownContent = document.getElementsByClassName('dropdown-content-menu')[0];

    createFolderButton.addEventListener('click', () => {
        if(dropdownContent.style.display === ""){
            dropdownContent.style.display ="block";
        }else{
            dropdownContent.style.display ="";
        }
    })
}

function logout(){
    let logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('validationToken');
        window.location.href="login.html"
    })
}


async function addNoteToFolder(noteId, folderId){
    const APIUrl = 'http://localhost:3000';
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

function handleAddToFolder(){
    const APIUrl = 'http://localhost:3000';
    document.addEventListener('click', function(event){
        if (event.target && event.target.id === "add-to-folder-button"){
            event.preventDefault();
            const folderSelect = event.target.closest('.dropdown-content').querySelector('#folder-select');
            const noteId = folderSelect.dataset.noteId;
            const folderId = folderSelect.value;
            addNoteToFolder(noteId, folderId)
        }
    })
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

async function fetchAllFolders(){
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

async function createOptionsSelectedFolders(){
    const allFolders = await fetchAllFolders();
    const folderMap = new Map();
    allFolders.forEach(folder => {
        folderMap.set( folder.folder_id, folder.folder_name);
    })
    const options = Array.from(folderMap.entries()).map(([id, folderName]) => {
        return `<option class="option-folders" value="${id}">${folderName}</option>`;
    });
    return options
}

async function refreshAllNotes(){
    const user = decodeJWT();
    const account_id = user.account_id;
    try{
        const response = await fetch(`${APIUrl}/getAllNotes`, {
            method:'POST', 
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({account_id: account_id})
        })
        const result = await response.json();
        sessionStorage.setItem('folderNotes', JSON.stringify(result.notes));
    }catch(error){
        console.error(error)
    }
}



export{addFolderForm, backToFolderButton, openModal,
    closeModal, decodeJWT, setupAddFolderForm, fetchNotebooks, backToFolderPage, toggleDropdown, handleAddToFolder,
    logout, fetchAllFolders, createOptionsSelectedFolders, createFolder, refreshAllNotes}