// dependencies
import  Express  from "express";
import session from "express-session";
import Handlebars from "express-handlebars";
import _Dirname from "./utils.js";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { init } from "./src/db/mongodb.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./src/config/passport_config.js";



//mongoDb imports/connection

init(); // mongo se conecta mediante este init


const server = Express();
server.use(Express.json());
server.use(Express.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser()); 
server.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "secret"
}))

// passport initialize
initializePassport();
server.use(passport.initialize());
server.use(passport.session());


// server
let httpServer = server.listen(process.env.PORT, () => {
    console.log("se inicializa server")
})

const io = new Server(httpServer);



// server.engine señala que motor pondremos en funcionamiento: handlebars 
server.engine("handlebars", Handlebars.engine())
// con (views, ruta) le vamos a indicar al servidor en que parte del proyecto estaran las vistas
server.set("views", _Dirname+ "/src/views");
// con (view engine, handlebars) indicamos que el motor que inicializamos arriba es el que queremos usar
server.set("view engine", "handlebars")
// seteamos de manera estatica nuestra carpeta public
server.use(Express.static(_Dirname + "/src/public"));
server.use(Express.static(_Dirname + "/src/views/layouts"));


// importacion ficheros DB
import productsDB from "./src/routes/DB/productos.js";
import cartsDB from "./src/routes/DB/carrito.js";
import usersDB from "./src/routes/DB/usuarios.js";


// endpoints
server.use("/productsDB", productsDB);
server.use("/cartsDB", cartsDB);
server.use("/userDB", usersDB)


// login/register

server.get("/:login_or_register", (req,res) => {

    let {params : {login_or_register}} = req;

    let script;

    if(login_or_register === "login"){

        script = {socket: '/socket.io/socket.io.js', login: 'login.js', mode: true};

    }
    else if(login_or_register === "register"){

        script = {socket: '/socket.io/socket.io.js', login: 'register.js', mode: false};

    }

    res.render("login", script);

})

// set/get/delete cookies

server.get("/cookies/delete_cookies/:cookie", (req,res) => {

    let cookie = req.params.cookie;

    res.clearCookie(cookie).send("la cookie fue removida");

})



//socket
io.on('connection', (clienteSocket) => {

    console.log(clienteSocket.id)

    //agregar producto con websocketss
    clienteSocket.on("product_data", (data) => {

        console.log(data);

        mercaderia.addProduct(JSON.parse(data));

    })

})




