import  express  from "express";
import { transport } from "../../../utils.js";



const mail = express.Router();
mail.use(express.json());


mail.get("/recuperatePassport", async(req,res) => {

    let result = await transport.sendMail({
        from: 'prueba de mail francobertin6@gmail.com',
        to: "francobertin6@gmail.com",
        subject:'correo de prueba',
        html:`
            <div>
                <h1>Esto es una prueba</h1>
            </div>`
    })

    console.log(result)
})


export default mail;
