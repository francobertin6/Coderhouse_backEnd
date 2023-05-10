import mongoose from "mongoose";

const modelProducts = new mongoose.Schema({
    id : {type : Number , require : true, unique : true},
    title : { type : String , require : true },
    description : { type : String , require : true},
    price : { type : Number , require : true},
    Thumbnail : { type : String , require : true},
    code : { type : String , require : true},
    stock  : { type : Number , require : true},
    status : { type : Boolean , require : true}
}, {timestamps: true});


export default mongoose.model('modeloProducto', modelProducts);