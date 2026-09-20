import ApiService from "./ApiService";

export default class StockWarningsService extends ApiService{
    constructor() {
        super("http://localhost:5050/stockWarnings/")
    }

    getFromOf(productId, date) {
        return this.getPeriodOf(productId, date, new Date())
    }

    getFrom(date) {
        return this.getFrom(undefined, date)
    }

    getPeriod(startDate, endDate) {
        this.getPeriodOf(undefined, startDate, endDate)
    }

    async getPeriodOf(productId, startDate, endDate) {
        const period = []
        const warnings = await this.get()
        for(var i in warnings) {
            const e = warnings[i]
            const date = new Date(e.date)
            if (productId === e.productId && date >= startDate && date <= endDate) {
                period.push(e)
            }
        };
        return period
    }
}
