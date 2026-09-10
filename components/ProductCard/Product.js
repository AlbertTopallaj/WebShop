export default class Product {
    constructor(id, name, price, img, weight, dimensions, stock, category, discountPercentage) {
        this.id = id
        this.name = name
        this.price = price
        this.img = img
        this.weight = weight
        this.dimensions = dimensions
        this.stock = stock
        this.category = category
        this.discountPercentage = discountPercentage
    }
}