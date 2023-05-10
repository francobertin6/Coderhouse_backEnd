
// funcion que utilizo para obtener la cookie de usuario y dar mensaje de bienvenida y tipo de usuario
(async function() {

    let name = document.getElementById("name");
    let typeUser = document.getElementById("typeUser");

    let JWT = await fetch('http://127.0.0.1:8080/userDB/current')
    .then( (response) => {
        return response.json()
    });

    console.log(JWT)

    name.innerHTML = JWT.username;
    typeUser.innerHTML = JWT.typeUser;

})();

// redirijo a las paginas de los productos
let buttons = document.querySelectorAll("button");
let buttonsArray = Array.from(buttons)

buttonsArray.map( (btn) => {

    btn.addEventListener("click", (e) => {

        console.log(e.target.id);
        window.location.href = "http://127.0.0.1:8080/productsDB/product/" + e.target.id;

    })
})


// logout

let logOut = document.getElementById("logout");

logOut.addEventListener("click", async (e) => {

    e.preventDefault();
    let result = await fetch('http://127.0.0.1:8080/cookies/delete_cookies/UserData');

    console.log(result);

    window.location.href = 'http://127.0.0.1:8080/login';

})