const btnLogoutElems = document.getElementsByClassName("btn-logout");

for (const btn of btnLogoutElems){
    btn.addEventListener("click", async(event)=>{
        window.location.href = "/logout";
    })
}