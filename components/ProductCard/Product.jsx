/*export default class Product {
    constructor(id, name, price, img, stock, weight, dimensions) {
        this.id = id
        this.name = name
        this.price = price
        this.img = img
        this.stock = stock
        this.weight = weight 
        this.dimensions = dimensions
    }
}*/

export default class Product {
    constructor(id, name, price, img, stock, weight, dimensions) {
        console.log("PRODUCT CONSTRUCTOR:", {
            id,
            name,
            price,
            img,
            stock,
            weight,
            dimensions
        });

        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.stock = stock;
        this.weight = weight;
        this.dimensions = dimensions;
    }
}