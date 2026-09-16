
export default class StockHistory {
    constructor() {
        this.history = []
    }

    isEmpty() {
        return this.history.isEmpty()
    }

    add(stockItem) {
        this.history.add(stockItem)
    }

    getFromOf(product, date) {
        return this.getPeriodOf(product, date, Date.now())
    }

    getFrom(date) {
        return this.getFrom(undefined, date)
    }

    getPeriodOf(product, startDate, endDate) {
        var period
        this.history.forEach(e => {
            if ((product.id === e.productId || product.id === undefined) && e >= startDate && e <= endDate) {
                period.add(e)
            }
        });
        return period
    }

    getPeriod(startDate, endDate) {
        this.getPeriodOf(undefined, startDate, endDate)
    }
}
