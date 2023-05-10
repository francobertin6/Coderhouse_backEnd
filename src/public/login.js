
// fetch del login

let userName = document.getElementById("usernameLogin");
let passWord = document.getElementById("passwordLogin");

// button login
let loginBtn = document.getElementById("login");

// button change_to_register/login
let change_to_register = document.getElementById("change_register");

change_to_register.addEventListener("click", (e) => {

    e.preventDefault();
    
    window.location.href = "http://127.0.0.1:8080/register";
})

// aca hago el proceso de login de los usuarios
loginBtn.addEventListener( "click", async (e) => {

    // const Socket = io();

    let usuario = userName.value;
   
                const cookies = await fetch("http://127.0.0.1:8080/userDB/cookies/set_cookies", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    //credentials: 'include',
                    body: JSON.stringify({
                        "username": usuario
                    })
                })

                cookies.json()
                .then( res => {console.log(res)})
                .catch((err) => {
                        console.log(err)
        });
        
     })




