import ApiService from "./ApiService"


export default class StockService extends ApiService {
    constructor() {
        super("http://localhost:5050/products/")
    }

    setStockOf(productId, amount) {
        return this.patch(productId, "stock", amount)
    }

    addToStockOf(product, amount) {
        if (amount <= 0) return
        return this.setStockOf(product, this.getStock(product)+amount)
    }

    removeFromStockOf(product, amount) {
        if (amount <= 0) return
        return this.setStockOf(product.id, this.getStock(product)-amount)
    }

    async getStock(productId) {
        return (await this.get(productId)).stock
    }
}



