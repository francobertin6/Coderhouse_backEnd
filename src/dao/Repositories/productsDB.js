"use strict";

import modelProducts from "../models/modelProducts.js";
import { ProductsMockingTool } from "../../../utils.js";


class productosDBcontroller {

    static async create( req,res ){

        console.log(req.user);

        const {body} = req;

        if(req.user.typeUser === "premium"){

            body.owner = req.user.id;

        }else if(req.user.typeUser === "admin"){

            body.owner = "admin"

        }
        
        const producto = {

            ...body

        }

        console.log(producto);

        const result = await modelProducts.create(producto);

        res.status(201).json(result)

    }

    static async get(req,res){

        const result = await modelProducts.find().lean();

        return result;

        res.status(200).json(result);
    }

    static async putByid( req,res ){

        const { params : { id }, body} = req;

        let user = req.user;

        
        if(user.typeUser === "premium" && body.owner === user.id){

            await modelProducts.updateOne( {_id: id}, {$set: body});

            res.status(204).send("producto actualizado por el admin")

        }else if(user.typeUser === "admin"){

            await modelProducts.updateOne( {_id: id}, {$set: body});

            res.status(204).send("producto actualizado por el dueño del producto")

        }else if(user.typeUser === "premium" && body.owner !== user.id){

            res.status(404).send("el usuario no puede modificar un producto que no es suyo")

        }

    }

    static async deleteByid( req,res ){

        let user = req.user;

        const { params: {id} } = req;

        let producto = await modelProducts.findById(id);

        if(user.typeUser === "admin"){

            await modelProducts.deleteOne({_id: id});

            res.status(204).send("producto eliminado por el admin");
        }
        else if(user.typeUser === "premium" && producto.owner === user.id){

            await modelProducts.deleteOne({_id: id});

            res.status(204).send("producto eliminado por su dueño");
        }
        else if(user.typeUser === "premium" && producto.owner !== user.id){

            res.status(400).send("el usuario no puede eliminar un producto que no es suyo")

        }
        
    }

    // MockingProducts

    static async MockingProducts(){

        let productos = [];

         for (let index = 0; index <= 100; index++) {

            
            productos.push(ProductsMockingTool());
            
        }

        return(productos);

    }

}

export default productosDBcontroller;