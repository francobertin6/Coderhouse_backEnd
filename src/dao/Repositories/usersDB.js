
import modelUsers from "../models/modelUsers.js";
import { createHash } from "../../../utils.js";
import { isvalidPassword } from "../../../utils.js";
import  Jwt  from "jsonwebtoken";


class usersDBcontroller {

    static async create( req,res ){

        const {username, password, name, lastName, email, dni} = req.body;

        let checkUser = await modelUsers.findOne({email: email});

        if(!checkUser){

            res.status(404).send("el usuario ya existe");

        }else{

        const usuario = {
            username: username,
            password: createHash(password),
            name: name,
            lastName: lastName,
            email: email,
            dni: dni,
            typeUser: "user"
        }

        console.log(usuario);

        const result = await modelUsers.create(usuario);


        res.status(201).json(result)

    }}

    static async get( req,res ){

        let result = await modelUsers.find().populate("cart");

        res.status(200).json(result);
    }

    static async getOneUser( req,res ){

        const { params : {username, password} } = req;

        let result = await modelUsers.findOne( {username: username});

        let comparePassword = isvalidPassword(result.password, password);
    
        console.log(comparePassword, result.password)

        if(result !== undefined && comparePassword !== false){

            res.status(200).send(result);
        }
        else{
            
            res.status(404).send("usuario o contraseña es incorrecto");

        }
    }

    static async changeTypeUser( req,res ){

        let JwtCookie = Jwt.decode(req.cookies.JWT);

        let typeUser = req.params.typeUser;

        let user = await modelUsers.findById(JwtCookie.id);


        if(user !== undefined){

            res.status(200).send("el tipo de usuario se ha modificado");

        }else{

            res.status(404).send("el tipo de usuario no pudo ser modificado");

        }

        user.typeUser = typeUser;

        user.save();

    }
}

export default usersDBcontroller;