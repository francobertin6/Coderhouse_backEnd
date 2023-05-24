"use strict";

import modelProducts from "../models/modelProducts.js";


class productosDBcontroller {

    static async create( req,res ){

        const {body} = req;

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

        await modelProducts.updateOne( {_id: id}, {$set: body});

        res.status(204).send("producto actualizado")
    }

    static async deleteByid( req,res ){

        const { params: {id} } = req;

        await modelProducts.deleteOne({_id: id});

        res.status(204).send("producto eliminado");
    }

}

export default productosDBcontroller;