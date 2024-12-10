import * as Modules from "../modules/module.js";

const folderContainer = document.getElementById('folders-notebook');
let logoutButton = document.getElementById('logout-button');


const APIUrl = 'http://localhost:3000';


Modules.toggleDropdown();
Modules.logout();
Modules.setupAddFolderForm(Modules.addFolderForm, Modules.createFolder);


async function showFolders(){
    const allFolders = await Modules.fetchAllFolders();

    allFolders.forEach(folder => {
        folderContainer.innerHTML += 
        `
            <div id="single-folder" class="single-folder-container button" data-id="${folder.folder_id}">
                <p>${folder.folder_name}</p>
            </div>
        `
    })
}

document.addEventListener('click', async function(event){
    if(event.target && event.target.id ==="single-folder"){
        const selectedFolder = event.target.closest(".single-folder-container");
        const user = Modules.decodeJWT();
        const account_id = user.account_id;
        const folderID = selectedFolder.dataset.id;

        try{
            const response = await fetch(`${APIUrl}/getSpecificFolder`, {
                method: 'POST', 
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({account_id:account_id, folder_id:folderID})
            })
            const result = await response.json();
            if(result.notes.length >= 1){
                sessionStorage.setItem('folderNotes', JSON.stringify(result.notes));
                window.location.href ="index.html"
            }else{
                alert(result.message)
            }
        }catch(error){
            console.error(error)
        }

    }else if(event.target.id === 'all-notes' ){
        const user = Modules.decodeJWT();
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
            window.location.href = "index.html";
        }catch(error){
            console.error(error)
        }
    }
})




document.addEventListener('DOMContentLoaded', async  () =>{
    const token = sessionStorage.getItem('validationToken');
    if(!token){
        alert("You're not logged in, please log in.")
        window.location.href="login.html";
    }
    await showFolders();

});



