
export default class StockItem {
	constructor(product, amount) {
		this.productId = product.id
		this.stock = product.stock + amount
		this.amount = amount
		this.date = new Date()
	}
}
