import utils from './utils.js';

const accountForm = document.getElementById("login-form");

/**
 * 
 * @param {Array} elements array berisi elemen yang teksnya ingin dikosongkan
 */
const clearText = (elements) => {
    for(let i = 0; i < elements.length; i++){
        if(elements[i].type === "text" || elements[i].type === "password"){
            elements[i].value = "";
        }
    }
}

accountForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const accountInfo = new FormData(accountForm);
    if (!utils.emailIsValid(accountInfo.get("email"))) {
        return alert("Format email tidak valid!");
    } else if (!utils.is8Chars(accountInfo.get("password") || !is8Chars(accountInfo.get("username")))) {
        return alert("Username dan password harus memiliki panjang minimal 8 karakter!");
    } else if (accountInfo.get("nama").length < 1) {
        return alert("Nama tidak boleh kosong!");
    } else {
        try {
            const response = await utils.sendToServer(accountInfo, "/admin/buatAkun");
            const message = await response.text();
            if(response.status === 200){
                clearInputs();
            }
            return alert(message);            
        } catch (e) {
            console.log(e);
        }
    }
});