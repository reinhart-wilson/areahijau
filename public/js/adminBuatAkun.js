import utils from './utils.js';

const accountForm = document.getElementById("login-form");

/**
 * 
 * @param {Array} elements array berisi elemen yang teksnya ingin dikosongkan
 */
const clearText = (elements) => {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].type === "text" || elements[i].type === "password") {
            elements[i].value = "";
        }
    }
}

function clearForm(form) {
    if (form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (
                (input.type === 'checkbox' || input.type === 'radio') && !input.checked
            ) {
                return;
            } else if (input.type !== 'submit') {
                input.value = '';
            }
        });
    } else {
        console.error('Form not found.');
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
            console.log(response.status)
            if (response.status >= 200 && response.status < 300 ) {
                clearForm(accountForm);
            }
            return alert(message);
        } catch (e) {
            console.log(e);
        }
    }
});