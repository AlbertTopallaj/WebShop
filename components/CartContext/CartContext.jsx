import {createContext, useContext, useEffect, useState} from "react";

const Context = createContext(null);

export function CartContext({children}) {

    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    function addToCart(product) {

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

    function removeFromCart(product) {
        setCartItems(items =>
            items.map(item => item.product.id === product.id ?
                { ...item, quantity: item.quantity - 1 } : item)
                .filter(item => item.quantity > 0)
        )
    }

    function CalculateSum() {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
    }

    return (
        <Context.Provider value={{addToCart, removeFromCart, CalculateSum, cartItems}}>
            {children}
        </Context.Provider>
    )
}

export function getCart() {
    return useContext(Context)
}
