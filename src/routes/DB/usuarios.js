import express from "express";
import _Dirname from "../../../utils.js";
import passport from "passport";
import { GenerateToken } from "../../../utils.js";
import Jwt  from "jsonwebtoken";

import usersDBcontroller from "../../dao/Repositories/usersDB.js";
import modelUsers from "../../dao/models/modelUsers.js";


const usersDB = express.Router();
usersDB.use(express.json());
usersDB.use(express.static(_Dirname + "/src/public"));


usersDB.post("/Post_dbusers", passport.authenticate('register', {failureRedirect: "http://127.0.0.1:8080/register"}), (req,res) => {

    res.redirect("http://127.0.0.1:8080/login");

})

usersDB.get("/Get_dbusers", (req,res) => {

    usersDBcontroller.get(req,res);

});


usersDB.get("/LoginUser", passport.authenticate('login', {failureRedirect: "http://127.0.0.1:8080/login"}), async (req,res) => {
   
    res.redirect("http://127.0.0.1:8080/productsDB/Get_dbproduct");

})

// COOKIES/SET_COOKIES: setea el token de JWT en las cookies cuando se hace el logib
usersDB.post("/cookies/set_cookies", async (req,res) => {

    const { username } = req.body;

    console.log(username);

    const user = await modelUsers.findOne({username:username});

    if(!user){

        res.status(404).json("el usuario es inexistente")

    }else{
        let token = GenerateToken(user);

        res.cookie("JWT", token)

        res.status(200).json("el token se guardo correctamente")
    }
});

// CURRENT: devuelve mediante el token de JWT los datos del usuario
usersDB.get("/current", async (req,res) => {

    let user = Jwt.decode(req.cookies.JWT);

    console.log(user)

    let usuario = await modelUsers.findById(user.id);

    res.status(200).json(usuario);

});


// login con github
usersDB.get("/github_login", passport.authenticate('github', {scope: ['user:email']}))

usersDB.get('/github_login/callback', passport.authenticate('github', { failureRedirect: 'http://127.0.0.1:8080/login' }), (req,res) => {

        console.log('req.user: ', req.user);
        req.session.user = req.user;
        res.status(200).send("el usuario ha podido loguearse");


})
 



export default usersDB;