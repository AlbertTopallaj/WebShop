export default class StockWarning {
  constructor(id, msg) {
    this.productId = id
    this.date = new Date()
    this.warning = msg
  }
}