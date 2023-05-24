

import modelCarts from "../models/modelCarts.js";
import  Jwt  from "jsonwebtoken";


class carritoDBcontroller {


    static async create(){

        let carrito = {
            "products": []
        }

        let result = modelCarts.create(carrito);

        return (await result)._id;

    }

    static async get( req,res ){
        
        const result = await modelCarts.find().populate("products.product").lean();

        let newArray = result.map( (p) => {return p});

        // res.status(200).json(result);

        return newArray;
        
    }

    static async getCartById(req, res) {

        const { params: { cid } } = req

        const result = await modelCarts.findById(cid).populate('products.product')

        if (!result) {

          return res.status(404).end()

        }

        res.status(200).json(result)
    }

    //AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR BODY SOLO EL PID Y CID
      static async addProductToCart(req, res) {

        const {  params : {pid, cid}, body } = req;
    
        try {

          const cart = await modelCarts.findById(cid).populate("products.product");
          

          if (!cart) {

            return res.status(404).json({ message: "CART NOT FOUND" });

          }

          const productIndex = cart.products.findIndex( (p) => p.product._id.toString() === pid);


          if (productIndex >= 0) {

            cart.products[productIndex].quantity =  cart.products[productIndex].quantity + body.quantity;

          } else {

            cart.products.push({ product: pid, quantity: body.quantity });

          }

          await cart.save();
          return res.status(200).json(cart);

        }
        catch (error) {

          console.log(error);
          return res.status(500).json({ message: "SERVER ERROR" });

        }
    }

    //ELIMINO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR BODY SOLO EL PID Y CID

      static async removeProductFromCart(req, res) {
        const { params : {pid, cid} } = req;
    
        try {

          const cart = await modelCarts.findById(cid).populate("products.product");

          if (!cart) {

            return res.status(404).json({ message: "CART NOT FOUND" });

          }

          const productIndex = cart.products.findIndex( (p) => p.product._id.toString() === pid);

          if (productIndex >= 0) {

          cart.products.splice(productIndex, 1);
           
            await cart.save();
            return res.status(200).json(cart);

          }else {

            return res.status(404).json({ message: "PRODUCT NOT FOUND" });

          }

        }catch (error) {

          console.log(error);
          return res.status(500).json({ message: "SERVER ERROR" });

        }
    }

    //PROCESO DE FINALIZACION DE COMPRA DE CARRITO

    static async purchaseProductFromCart(req) {

        let cartId = Jwt.decode(req.cookies.JWT).cart;

        let result = await modelCarts.findById(cartId).populate('products.product');

        return result;

    }

    //ELIMINO UN CARRITO POR ID: PASA POR BODY CID

      static async deleteCart(req, res) {
        const { cid } = req.params;
    
        try {

            const result = await modelCarts.findByIdAndDelete(cid);

            if (!result) {

                return res.status(404).json({ message: "CART NOT FOUND" });

            }
            return res.status(200).json({ message: "CART DELETED" });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ message: "SERVER ERROR" });
            
        }
    }
}


export default carritoDBcontroller;