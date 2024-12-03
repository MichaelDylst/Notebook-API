const APIUrl = 'http://localhost:3000'
let signupButton = document.getElementById('signup-button');
let loginButton = document.getElementById('login-button');

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
    try{
        const response = await fetch(`${APIUrl}/login`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        })
        const result = await response.json();
        if(result){
            let validationToken = result.syncToken;
            sessionStorage.setItem('validationToken', validationToken);
            changePage();
        }else{
            alert(result.error)
        }
    }catch(error){
        alert("There was an error. Please try again.");
        console.error(error)
    }
}

function changePage(){
    window.location.href = "index.html";
}

signupButton.addEventListener('click', () => {
    createUser();
})

loginButton.addEventListener('click', () => {
    loginUser();
})

