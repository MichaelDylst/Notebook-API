let welcomeMessage = document.getElementById('username-p');
let showPassword = false;
let newPasswordShow = document.getElementById('new-password-show');
let oldPasswordShow = document.getElementById('old-password-show');
let oldPasswordField = document.getElementById('old-password');
let newPasswordField = document.getElementById('new-password');
let form = document.getElementById('change-pass-form');
const changePasswordButton = document.getElementById('change-pass-button');
const APIUrl = 'http://localhost:3000';


form.onsubmit = async function(event){
    event.preventDefault();
    await changePassword();
}

async function changePassword(){
    let oldPasswordField = document.getElementById('old-password').value;
    let newPasswordField = document.getElementById('new-password').value;
    const user = decodeJWT();
    const user_id = user.account_id;

    try{
        const response = await fetch(`${APIUrl}/changePassword`, {
            method: 'PATCH', 
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({user_id: user_id, oldPass: oldPasswordField, newPass: newPasswordField})
        })
        const result = await response.json();
    }catch(error){
        console.error(error);
    }
}

function decodeJWT(){
    const token = sessionStorage.getItem('validationToken');
    if(!token){
        alert("You're not logged in, please log in.")
        window.location.href="login.html";
    }
    const base64URL = token.split(".")[1];
    const base64 = base64URL.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
}

changePasswordButton.addEventListener('click', () => {
    changePassword();
})

newPasswordShow.addEventListener('click', function(event){
    if (showPassword === false){
        showPassword = true;
        newPasswordField.type = "text"
    }else{
        showPassword = false;
        newPasswordField.type = "password";
    }
})

oldPasswordShow.addEventListener('click', function(event){
    if (showPassword === false){
        showPassword = true;
        oldPasswordField.type = "text"
    }else{
        showPassword = false;
        oldPasswordField.type = "password";
    }
})

document.addEventListener('DOMContentLoaded', () =>{
    const user = decodeJWT();
    welcomeMessage.innerHTML += user.username + "!";
})