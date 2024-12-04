let welcomeMessage = document.getElementById('username-p');
let showPassword = false;
let oldPasswordField = document.getElementById('old-password');
let newPasswordField = document.getElementById('new-password');
let newPasswordShow = document.getElementById('new-password-show');
let oldpasswordShow = document.getElementById('old-password-show');

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

document.addEventListener('DOMContentLoaded', () =>{
    const user = decodeJWT();
    console.log(user);
    welcomeMessage.innerHTML += user.username + "!";
})