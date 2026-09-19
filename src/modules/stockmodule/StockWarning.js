export default class StockWarning {
  constructor(msg) {
    this.date = new Date()
    this.warning = msg
  }
}