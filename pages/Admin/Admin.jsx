import { useEffect, useState } from "react"
import { getModules } from "../../scripts/ModuleRegistry"
import StockModule from "../../src/modules/stockmodule"

export default function LoadAdmin() {
    const [warningBlock, setWarningBlock] = useState()
    const [stockHistory, setStockHistory] = useState()
    const [stockHistoryUpdate, setstockHistoryUpdate] = useState(0)
    const [select, setSelect] = useState()
    const [option, setOption] = useState()
    const [amount, setAmount] = useState(0)
    const stockModule = getModules().find(m => m === StockModule)?.instance

    useEffect(() => {
        fillStockHistory()
        fillWarningBlock()
    }, [stockHistoryUpdate])
        
    useEffect(() => {
        fillSelector()
    }, [])

    async function fetchProducts() {
        const url = "http://localhost:5050/products"
        const response = await fetch(url)
        const products = await response.json()

        return products
    }

    async function fillStockHistory() {
        const history = await stockModule.getHistory()
        
        var block = []

        for(var i in history) {
            const o = history[i]
            block.push(<p key={i}>{o.productId} | {o.stock} | {o.amount} | {o.date}</p>)
        }

        setStockHistory(block)
    }

    async function fillWarningBlock() {
        const warnings = await stockModule.getWarnings()
        
        var block = []

        for(var i in warnings) {
            const w = warnings[i]
            block.push(<p key={i}>{w.warning} | {w.date}</p>)
        }

        setWarningBlock(block)
    }

    async function fillSelector() {
        const products = await fetchProducts()
        const options = []

        setOption(products[0].id)

        for(var i in products) {
            const p = products[i]
            options.push(<option key={p.id} value={p.id}>{p.title}</option>)
        }

        setSelect(options)
    }

    async function orderRequest() {
        if (!amount || amount <= 0) return
        await stockModule.addToStock(option, Number(amount))
    }

    async function checkStockHistoryUpdate() {
        const update = (await stockModule.getHistory()).length
        if(stockHistoryUpdate < update) setstockHistoryUpdate(update)
    }

    function refresh() {
        checkStockHistoryUpdate()
    }

    return (
        <>
            <div>
                <h1>Admin Page</h1>
                <div className="stock-history">{stockHistory}</div>
                <div className="warning-block">{warningBlock}</div>
                <button onClick={refresh}>Refresh</button>
                <div className="add-to-stock">
                    <p>Product</p>
                    <select name="products-list" onChange={(e) => {setOption(e.target.value)}} id="products-list">
                        {select}
                    </select>
                    <p>Amount</p>
                    <input id="product-amount" value={amount} onChange={(e) => {setAmount(e.target.value)}} type="number" min="1" />
                    <button id="order-button" onClick={() => {
                        orderRequest()
                    }}>Order</button>
                </div>
            </div>
        </>
    )
}
