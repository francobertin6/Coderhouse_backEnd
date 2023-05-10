import mongoose from "mongoose";

const modelUsers = new mongoose.Schema({
    username: {type: String, unique: true},
    name: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    dni: {type: Number, unique: true},
    age: {type: Number},
    password: {type: String, unique: true},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "modeloCarrito"},
    typeUser: {type: String}
})

export default mongoose.model('modelousuario', modelUsers);