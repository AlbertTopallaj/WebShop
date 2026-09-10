import { useSearchParams } from "react-router"

export function setStock(product, amount) {
    dbStockMod(product, amount)
}

export function addToStock(product, amount) {
    if (amount <= 0) return
    dbStockMod(product, product.stock+amount)
}

export function removeFromStock(product, amount) {
    if (amount <= 0) return
    dbStockMod(product, product.stock-amount)
}

async function dbStockMod(product, mod) {
    await fetch(`http://localhost:5050/products/${product.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( { stock: mod})
        })
}

