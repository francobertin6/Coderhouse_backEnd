import * as fs from "fs";


// carritoJson: verifica si existe el file carrito.json.txt
const carritoJson : any = () => {

    let exists =  fs.existsSync("./files/carrito.json.txt")

    if(exists === true){

        return JSON.parse(fs.readFileSync("./files/carrito.json.txt", "utf-8"));

    }
    else{

        return undefined

    }

}

const CarritoData = () : any => {

    console.log(carritoJson());

    if(carritoJson() === undefined){
        return [];
    }
    else{
        return carritoJson();
    }

}


class CartManager{

    Carts:Array<any>
    id:number
    productsIds:number[]

    constructor(productsIds:number[], carritoJson: []){
        this.Carts = carritoJson;
        this.id = 0;
        this.productsIds = productsIds;
    }

    // createCart: crea carritos nuevos con un id en particular para cada uno y un array vacio para que los clientes los llenen de productos 

    createCart(){
        let newCart = Object();

        newCart.id = this.id;
        newCart.products = [];

        this.id++;
        console.log(newCart);
        this.Carts.push(newCart);

        fs.writeFileSync("./files/carrito.json.txt", JSON.stringify(this.Carts));
    }

    // postProductsId: se fija si existen productos creados y trae los id de ellos para ponerlos en productsIds

    postProductsId(numberArray: number[]){
        this.productsIds = numberArray;
    }


    // agregateProduct_to_cart: agrega en un carrito en especifico ( por su id ) un producto en especifico ( por su id )

    AgregateProduct_to_cart(cartId:number, productId:number){

        let findCart = this.Carts.find(element => element.id === cartId);
        let findProduct = this.productsIds.find(element => element === productId);

        if(findCart !== undefined && findProduct !== undefined){
            
            let quantityCheck = findCart.products.find((element: {product : Number}) => {

                return element.product === productId;

            });

            console.log(quantityCheck);

            if(quantityCheck !== undefined){

                let findIndex = findCart.products.findIndex((element:Object) => element === quantityCheck);

                quantityCheck.quantity++

                findCart.products.splice(findIndex, 1, quantityCheck);
                console.log(findCart);

                fs.writeFileSync("./files/carrito.json.txt", JSON.stringify(this.Carts));
            }
            else{
                let newProduct = Object();

                newProduct.product = findProduct;
                newProduct.quantity = 1;

                findCart.products.push(newProduct);
                console.log(findCart);

                fs.writeFileSync("./files/carrito.json.txt", JSON.stringify(this.Carts));

            }

        }else{
            console.log("o carrito no se ha creado o no existe un producto con ese id");
        }

    }


    // getProducts_to_cart: devuelve los productos que se encuentren en un carrito en especifico

    getProducts_to_cart(cartId:number){
        let findCart = this.Carts.find(element => element.id === cartId);

        if(findCart !== undefined){
            
            console.log(findCart.products);
            return findCart.products;
        }
        else{
            console.log("no se han encontrado carrito con ese id")
        }
    }

}


let Manager = new CartManager([], CarritoData());


export default Manager;