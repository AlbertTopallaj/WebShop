export function addToCart(setCartItems, product) {

    setCartItems(items => {
        const exists = items.find(item => item.product.id === product.id)

        if (exists) {
            return items.map(item => item.product.id === product.id ?
                { ...item, quantity: item.quantity + 1 } : item)
        }

        return [
            ...items,
            {
                product: product,
                quantity: 1
            }
        ]

    })
}

export function removeFromCart(setCartItems, product) {
    setCartItems(items =>
        items.map(item => item.product.id === product.id ?
            { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0)
    )
}

export function CalculateSum(CartItems) {
    return CartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
}