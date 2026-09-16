import StockHistory from "./StockHistory"
import StockItem from "./StockItem"
import { setStockOf } from "./StockService"
import StockWarning from "./StockWarning"

export default class Storage {
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

    constructor() {
        this.productsPath = "http://localhost:5050/products/"
        this.stockHistory = new StockHistory()
        this.stockWarnings = []
    }

    changeStockOf(product, mod) {
        try {
            const apiResponse = setStockOf(product, mod)
            if (!apiResponse.ok) {
                throw new Error(apiResponse.status)
            }
            this.stockHistory.add(new StockItem(product, mod - product.stock))
            const response = this.checkLastWeekStockChangeOf(product)
            if (response != undefined) this.stockWarnings.add(new StockWarning(response))
        } catch(e) {
            console.error(e.message)
        }
    }

    checkLastWeekStockChangeOf(product) {
        try {
            const date = new Date()
            date.setDate(date.getDate() - 7)
            const sum  = this.saleAmountOfSince(product, date)
            if (sum > product.stock) return `Stock for ${product.name} is lower than predicted week by ${product.stock-sum}`
        } catch(e) {
            console.error(e.message)
        }
    }

    saleAmountOfSince(product, date) {
        const period = StockHistory.getFromOf(product, date)
        if (period.isEmpty()) {
            return undefined
        }
        const sum = period.reduce((sum, e) => sum + e.amount, 0)
        return sum
    }
}
