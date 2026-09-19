import ApiService from "./ApiService";

export default class StockHistoryService extends ApiService{
    constructor() {
        super("http://localhost:5050/stockHistory/")
    }

    getFromOf(product, date) {
        return this.getPeriodOf(product, date, new Date())
    }

    getFrom(date) {
        return this.getFrom(undefined, date)
    }

    getPeriod(startDate, endDate) {
        this.getPeriodOf(undefined, startDate, endDate)
    }

    async getPeriodOf(product, startDate, endDate) {
        const period = []
        const history = await this.get()
        for(var i in history) {
            const e = history[i]
            const date = new Date(e.date)
            if (product.id === e.productId && date >= startDate && date <= endDate) {
                period.push(e)
            }
        };
        return period
    }
}