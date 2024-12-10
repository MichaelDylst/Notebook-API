const APIUrl = 'http://localhost:3000'
let signupButton = document.getElementById('signup-button');
let loginButton = document.getElementById('login-button');
let form = document.getElementById('login-form');

form.onsubmit = async function(event){
    event.preventDefault();
    const value = event.submitter.value;
    if(value ==="Log-in"){
        await loginUser();
    }else{
        await createUser();
    }
}

async function createUser(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    try{
        const response = await fetch(`${APIUrl}/createUser`, {
            method:'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password})
        })
        const result = await response.json();
        if(response.ok){
            alert("User successfully created.")
        }else{
            alert("User already exists")
        }
    }catch(error){
        alert("There was an error. Please try again.");
        console.error(error)
    }
}

async function loginUser(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if(username === "" || password == "" ){
        alert('You need to enter a username and password.')
        return;
    }else{

    try{
        const response = await fetch(`${APIUrl}/login`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        })
        const result = await response.json();
        if(result.syncToken){
            let validationToken = result.syncToken;
            sessionStorage.setItem('validationToken', validationToken);
            window.location.href = "folder.html"
        }else{
            alert("Unexpected error: Wrong Password!")
        }
    }catch(error){
        alert("There was an error. Please try again.");
        console.error(error)
    }
}}

function changePage(){
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', () =>{
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
})