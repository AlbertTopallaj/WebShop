import Product from "../../components/ProductCard/Product.js";

export default class Discount extends Product {
    constructor(id, code, discountAmount, img, type) {
        super(id, code, discountAmount, img);
        this.type = type
    }
}