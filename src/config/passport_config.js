import passport from "passport";
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import modelUsers from "../dao/models/modelUsers.js";
import modelCarts from "../dao/models/modelCarts.js";
import { createHash, isvalidPassword } from "../../utils.js";



const initializePassport = () => {

    // FORMULARIO DE REGISTRO DE USUARIO
    passport.use('register', new localStrategy(

        {passReqToCallback:true, usernameField:'email'}, async(req, email, password,done) => {

        const {username, name, lastname, age, dni} = req.body;

        try{

        if(!username || !name || !lastname || !dni || !age){
            console.log(req.body)
            return done( new Error("todos los campos deben ser completados"));
        }

        let checkUser = await modelUsers.findOne({email: email});

        if(checkUser){
            console.log('usuario ya registrado');
            return done(null, false);

        }else{

        const usuario = {
            username: username,
            password: createHash(password),
            name: name,
            lastName: lastname,
            email: email,
            age: age,
            dni: dni,
            typeUser: "user"
        }

        let user = await modelUsers.create(usuario);
        
        done(null, user);

        }}
    catch(err){
        console.log(err)
        return done(new Error("el error causado es este ", err.message));
       
    }
    }))
    // FORMULARIO DE INICIO DE SESION DE USUARIO
    passport.use('login', new localStrategy(async(username, password, done)=> {

        console.log(username, password)

        try{
            const user = await modelUsers.findOne({username:username});
            console.log(user)

            if(!user){
                console.log("usuario no encontrado");
                return done(null,false);
            }

            if(!isvalidPassword(user.password, password)){
                console.log("contraseña no valida")
                return done(null, false);
            }

            done(null, user);

        }catch(err){
            return done(err);
        }
    }))
    // FORMULARIO DE INICIO DE SESION CON GITHUB DE USUARIO
    passport.use('github', new GithubStrategy({
        clientID: "Iv1.2f5c1b43e06d1a3es",
        clientSecret: "4d819f6c915ba6335c46d418dffb0a6067850b17",
        callbackURL: "http://127.0.0.1:8080/userDB/github_login",
      }, async (accessToken, refreshToken, profile, done) =>{


        try{
            console.log('profile: ', profile);

            let user = await modelUsers.findOne({email: profile._json.email});

            if(!user){
                 
                user = await modelUsers.create({
                    username: "",
                    password: "",
                    name: profile._json.name,
                    lastName: "",
                    email: profile._json.email,
                    dni: "",
                    typeUser: "user"
                })
            }



            done(null, user)

        }
        catch(err){
            return done(new Error("algo a fallado ", err.message));
        }

        }))
    // FORMULARIO DE JWT
  
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([CookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEYS
    }, (payload, done) => { 
        return done(null, payload);
    }
    
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser( async (id, done) =>{
        let user = await modelUsers.findById(id);
        done(null, user);
    })

}

function CookieExtractor(req){
    let token = null;
    console.log(req.cookies);
    if(req && req.cookies){
        token = req.cookies.JWT;
    }
    return token;
}

export default initializePassport;