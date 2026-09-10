import Product from "../../components/ProductCard/Product.js";


export default class Discount extends Product {
    constructor(id, name, price, img, type, discountAmount, discountCondition) {
        super(id, name, price, img)
        this.type = type
        this.discountAmount = discountAmount
        this.discountCondition = discountCondition
        this.persist = false
    }
}