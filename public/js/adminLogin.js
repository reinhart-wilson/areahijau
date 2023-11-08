import utils from './utils.js';

const submitButton = document.querySelector(".tombol_login");
const usernameField = document.querySelector('[name="username"]');
const passwordField = document.querySelector('[name="password"]');
const loginForm = document.getElementById("login-form");

const isMoreThan8Chars = (str) => {
    if (str.length < 8) {
        return false;
    } else {
        return true;
    }
};

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isMoreThan8Chars(usernameField.value) ||
        !isMoreThan8Chars(passwordField.value)) {
        alert(
            "Username atau password tidak boleh lebih pendek dari 8 karakter!"
        );
    } else {
        try {
            const accountInfo = new FormData(loginForm);
            const response = await utils.sendToServer(accountInfo, "/login");
            const message = await response.text();
            if (response.status === 200) {
                alert("Login berhasil. Anda akan diarahkan ke halaman admin.");
                window.location.href = "/admin";                
            } else {
                return alert(message);
            }            
        } catch (e) {
            console.log(e);
        }
    }
});
