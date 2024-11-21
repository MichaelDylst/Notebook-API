let saveButton = document.getElementById("save-button");


saveButton.onclick = function(){
    //console.log("joe " + e)
    //e.preventDefault()
    let titleField = document.getElementById("title-field").value;
    let textAreaField = document.getElementById("text-area-field").value;

    console.log("De inhoud van het title-field is: " + titleField)
    console.log("De inhoud van het text-area-field is: " + textAreaField)
};

