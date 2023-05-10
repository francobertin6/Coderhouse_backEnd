import * as fs from "fs";
const productosJson = () => {
    let exists = fs.existsSync("./files/productos.json.txt");
    if (exists === true) {
        return JSON.parse(fs.readFileSync("./files/productos.json.txt", "utf-8"));
    }
    else {
        return undefined;
    }
};
// funcion que verifica si existe el archivo
const ProductsData = () => {
    
    if (productosJson() === undefined) {
        return [];
    }
    else {
        return productosJson();
    }
};
// funcion que devuelve el numero de id que tendra la clase
const GetId = () => {
    if (productosJson() === undefined) {
        return 0;
    }
    else {
        return productosJson().length;
    }
};
class ProductManager {
    constructor(products, id) {
        this.Products = products;
        this.id = id;
        this.path = "./files/productos.json.txt";
    }
    addProduct(producto) {
        console.log(this.Products);
        let checkCode = this.Products.some(element => producto.code === element.code);
        if (checkCode) {
            console.log("el codigo se ha repetido con otro producto");
        }
        else {
            producto.id = this.id;
            this.Products.push(producto);
            this.id++;
            console.log("el producto " + JSON.stringify(producto) + " se ha agregado al array, ahora el id de la clase es " + this.id);
            fs.writeFileSync(this.path, JSON.stringify(this.Products));
        }
    }
    getAllProducts() {
        return this.Products;
    }
    getLimitedProducts(limit) {
        if (this.Products.length < limit) {
            return this.getAllProducts();
        }
        else {
            let newArray = [];
            for (let index = 0; index < limit; index++) {
                const element = this.Products[index];
                newArray.push(element);
            }
            return newArray;
        }
    }
    getProduct(id) {
        let find = this.Products.find(element => element.id === id);
        if (find === undefined) {
            console.log("el elemento no se encuentra");
        }
        else {
            return find;
        }
    }
    updateProduct(id, newProduct) {
        let producto = this.Products.findIndex(element => element.id === id);
        this.Products.splice(producto, 1, newProduct);
        console.log("el producto: " + producto + "\n" + "se ha cambiado por: " + JSON.stringify(newProduct));
    }
    deleteProduct(id) {
        let producto = this.Products.findIndex(element => element.id === id);
        this.Products.splice(producto, 1);
    }
    deleteAllProducts() {
        this.Products = [];
    }
}
const mercaderia = new ProductManager(ProductsData(), GetId());
export default mercaderia;
