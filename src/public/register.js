
// fetch del register

let Reg_usernarme = document.getElementById("username");
let Reg_password = document.getElementById("password");
let Reg_name = document.getElementById("name");
let Reg_lastname = document.getElementById("lastname");
let Reg_email = document.getElementById("email");
let Reg_dni = document.getElementById("dni");

// button register
let registerBtn = document.getElementById("register");
let change_to_login = document.getElementById("change_login");

change_to_login.addEventListener("click", (e) => {
    
    e.preventDefault();

    window.location.href = "http://127.0.0.1:8080/login";
    
})


