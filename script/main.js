let saveButton = document.getElementById("save-button");
const APIUrl = 'http://localhost:3000'


saveButton.onclick = async function(event){
    event.preventDefault();
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    console.log("De inhoud van het title-field is: " + titleField)
    console.log("De inhoud van het text-area-field is: " + textAreaField)

    const response = await fetch(`${APIUrl}/submit` , {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: titleField, description: textAreaField})
    });
    console.log(response)
};

