import { registerModule } from "../../../scripts/ModuleRegistry"
import StockHistoryService from "./StockHistoryService"
import StockItem from "./StockItem"
import StockService from "./StockService"
import StockWarning from "./StockWarning"
import StockWarningsService from "./StockWarningsService"

export default class StockModule {
    static descriptor = {
        name: "Storage",
        methodsAndInputs:  [
            {
                method: 'changeStockOf',
                inputs: [
                    {
                        name: "product",
                        type: "Product",
                        label: "The product to modify the stock of",
                        required: "true"
                    },
                    {
                        name: "mod",
                        type: "Number",
                        label: "The new value of stock",
                        required: "true"
                    }
                ],
                output: ""
            },
            {
                method: "checkLastWeekStockChangeOf",
                inputs: [
                    {
                        name: "product",
                        type: "Product",
                        label: "The product to check for, if undefined then checks for all products in history",
                        required: "false"
                    }
                ],
                output: ""
            },
            {
                method: "saleAmountOfSince",
                inputs: [
                    {
                        name: "product",
                        type: "Product",
                        label: "The product to check for, if undefined then checks for all products in history",
                        required: "false"
                    },
                    {
                        name: "date",
                        type: "Date",
                        label: "Cut off point for checking history, if undefined gives entire history",
                        required: "false"
                    }
                ],
                output: "Sum of the amount of said product sold from said date till today"
            }
        ]
    }

    static instance

    constructor() {
        if (!StockModule.instance) {
            StockModule.instance = this
        } else return
        this.stockService = new StockService()
        this.stockHistory = new StockHistoryService()
        this.stockWarnings = new StockWarningsService()
    }

    removeFromStock(product, amount) {
        this.changeStockOf(product, product.stock-amount)
    }

    async changeStockOf(product, mod) {
        try {
            const apiResponse = this.stockService.setStockOf(product, mod)
            if (apiResponse === undefined) {
                throw new Error(apiResponse.status)
            }
            await this.stockHistory.post("", new StockItem(product, mod - product.stock))
            const response = await this.checkLastWeekStockChangeOf(product)
            if (response != undefined) this.stockWarnings.post("", new StockWarning(response))
        } catch(e) {
            console.error(e.message)
        }
    }

    async checkLastWeekStockChangeOf(product) {
        try {
            // Todo: change get
            product = await this.stockService.get(product.id)
            const date = new Date()
            date.setDate(date.getDate() - 7)
            const sum  = await this.saleAmountOfSince(product, date)
            if ((-1 * sum) > product.stock) return `Stock for ${product.name} is lower than predicted week by ${product.stock-sum}`
        } catch(e) {
            console.error(e.message)
        }
    }

    async saleAmountOfSince(product, date) {
        const period = await this.stockHistory.getFromOf(product, date)
        if (period.length == 0) {
            return undefined
        }
        const sum = period.reduce((sum, e) => sum + e.amount, 0)
        return sum
    }
}

registerModule(StockModule)
