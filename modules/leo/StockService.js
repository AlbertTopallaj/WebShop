
export function setStockOf(product, amount) {
    return dbStockModOf(product, amount)
}

export function addToStockOf(product, amount) {
    if (amount <= 0) return
    return dbStockModOf(product, product.stock+amount)
}

export function removeFromStockOf(product, amount) {
    if (amount <= 0) return
    return dbStockModOf(product, product.stock-amount)
}

async function dbStockModOf(product, mod) {
    const response = undefined
    try {
        await fetch(`${this.productsPath}${product.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( { stock: mod } )
            })
        if (!response.ok) {
            throw new Error(response.status)
        }
    } catch (e) {
        console.error(e.message);
    }
    return response
}
