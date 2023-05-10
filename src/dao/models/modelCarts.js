import mongoose from "mongoose";


const modelCarts = new mongoose.Schema({
    products : { type : [{ type: mongoose.Schema({
        product : { type : mongoose.Schema.Types.ObjectId, ref: 'modeloProducto' , require : true},
        quantity : { type : Number , require : true}
    })}], require : true}
}, {timestamps: true});

export default mongoose.model('modeloCarrito', modelCarts);