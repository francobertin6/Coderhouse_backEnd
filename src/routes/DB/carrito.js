import  express  from  "express";
import _Dirname from "../../../utils.js";
import { TypeUserCheck } from "../../../utils.js";

import carritoDBcontroller from "../../dao/Repositories/cartsDB.js";

const cartsDB = express.Router();
cartsDB.use(express.json());
cartsDB.use(express.static(_Dirname + "/src/public"));

// agrega un carrito nuevo
cartsDB.post( "/Post_dbcarrito", (req,res) => {

    carritoDBcontroller.create(req,res);

});
// devuelve todos los carritos
cartsDB.get( "/Get_dbcarrito/:id?", async (req,res) => {

    let carrito = await carritoDBcontroller.get(req,res);

    let id = req.params.id;
    
    let newFilter = carrito.filter( (cart) => {
        
        console.log(cart._id.toString() === id)
        return cart._id.toString() === id; 
    
    });

    console.log(newFilter)

    let scripts;

    if(id === undefined){
        
        scripts = { cart: carrito};
    }else{

        scripts = { cart: newFilter};
    }

    res.render("cart", scripts);

});
// devuelve un carrito en especifico
cartsDB.get( "/Get_dbcarrito/:cid", (req,res) => {

    carritoDBcontroller.getCartById(req,res);

});
// agregar un producto en carrito
cartsDB.put( "/Put_dbcarrito/:cid/product/:pid", TypeUserCheck("user"), (req,res) => {

    carritoDBcontroller.addProductToCart(req,res);

});
// elimino un producto en carrito
cartsDB.put( "/Put_dbcarrito/:cid/eliminateProduct/:pid", (req,res) => {

    carritoDBcontroller.removeProductFromCart(req,res);

});
// finalizo la compra del carrito
cartsDB.put("/Put_dbcarrito/purchase", TypeUserCheck("user"), async (req,res) => {

    let cart = carritoDBcontroller.purchaseProductFromCart(req);

    let data = await cart.then((data) => {

        //console.log(data)
        
        let stock_quantity = data.products.map( (producto) => {
            return ({
                id_producto: producto.product._id,
                quantity: producto.quantity,
                stock: producto.product.stock
            })
        });

        return (stock_quantity);
    
    });

    let enoughStock = data.filter( (element) => {
        if(element.quantity > element.stock){
            return element;
        }
    });


    if(enoughStock.length === 0){

        res.status(200).send("todos los productos tienen stock y pueden proceder a ser comprados");

    }else{

        res.status(404).send("uno de los productos no tiene suficiente stock, esta compra no puede ser efectuada");

    }

})
// elimino un carrito entero
cartsDB.delete( "/Delete_dbcarrito/:cid", (req,res) => {

    carritoDBcontroller.deleteCart(req,res);

});



export default cartsDB;