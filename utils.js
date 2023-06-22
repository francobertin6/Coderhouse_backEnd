import { fileURLToPath } from "url";
import { dirname } from "path";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import {faker} from "@faker-js/faker";

const fileName = fileURLToPath(import.meta.url);
const _Dirname = dirname(fileName);

// hasheo es la forma que tiene bcrypt para incriptar nuestra constraseña, con saltSync le digo con cuantos caracteres tiene que encriptarla
export const createHash = (password) => {return bcrypt.hashSync(password, bcrypt.genSaltSync(10))};

// aca para validar la contraseña hasheada con la contra del usuario
export const isvalidPassword = (Password,password) => {return bcrypt.compareSync(password, Password)};

// JWT auth

export const GenerateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        cart: user.cart,
        typeUser: user.typeUser
    }
    const token = Jwt.sign(payload, process.env.PRIVATE_KEYS,{expiresIn:'24h'});
    return token;
}

export const authToken = (Strategy) => (req,res,next) => {

    passport.authenticate(Strategy, function(err, user, info){
        
        console.log("info: " + info);
        console.log("user: " + JSON.stringify(user));

        if(err){
            return next(err);
        }
        if(!user){
            return next('unauhtorized', 401)
        }
        req.user = user;
        next()
        
    })(req,res,next)
}

// middleware : TYPEUSER_check

export const TypeUserCheck = () => (req,res,next) => {

    let user = Jwt.decode(req.cookies.JWT);

    console.log(user);

    if(user.typeUser === "admin" || "premium"){

        req.user = user;
        next();

    }
    else{

        res.status(401).send("el usuario no tiene los permisos para realizar esta accion")

    }

}

// MOCKING TOOL

export const ProductsMockingTool = () => {

    return({
        "title": faker.commerce.productName(),
        "description": faker.commerce.productDescription(),
        "price": faker.commerce.price(),
        "Thumbnail": faker.image.urlPlaceholder({format:"jpg"}),
        "code": faker.finance.accountNumber(5),
        "stock": faker.number.int({max: 100}),
        "status": true
    })
    
}


export default _Dirname;