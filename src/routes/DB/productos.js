import  express  from "express";
import _Dirname from "../../../utils.js";

import productosDBcontroller from "../../dao/Repositories/productsDB.js";
import { authToken, TypeUserCheck } from "../../../utils.js";

const productsDB = express.Router();
productsDB.use(express.json());
productsDB.use(express.static(_Dirname + "/src/public"));


productsDB.post( "/Post_dbproduct", TypeUserCheck("admin"), (req, res) => {

    productosDBcontroller.create(req,res);

});

productsDB.get("/Get_dbproduct", authToken('jwt'), async (req,res) => {

    console.log(req.user);

    let productos = await productosDBcontroller.get(req,res);

    console.log(productos);

    const scripts = { socket: '/socket.io/socket.io.js', index: 'index.js', productos: productos }

    res.render("index", scripts);

});

productsDB.put( "/Put_dbproduct/:id", TypeUserCheck("admin"), (req,res) => {

    productosDBcontroller.putByid(req,res);

});

productsDB.delete( "/Delete_dbproduct/:id", TypeUserCheck("admin"), (req,res) => {

    productosDBcontroller.deleteByid(req,res);

})

productsDB.get("/product/:cid", authToken("jwt"), async (req,res) => {

    let cid = req.params.cid;

    let productos =  await productosDBcontroller.get(res);

    let producto = productos.filter( (element) => element._id.toString() === cid);
    console.log(producto);

    const scripts = { socket: '/socket.io/socket.io.js', index: 'index.js', producto: producto }

    res.render("product", scripts)

});


export default productsDB