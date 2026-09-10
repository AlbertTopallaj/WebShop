import {createContext, useContext, useEffect, useState} from "react";
import {getInstances} from "../../scripts/ModuleRegistry.js";
import {useToast} from "../Toast/Toast.jsx";

const Context = createContext(null);

export function CartContext({children}) {

    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : [];
    });

    const {toast} = useToast()

    const campaignInstance = getInstances().find(instance => instance.constructor.descriptor.name === "campaign")

    useEffect(() => {
        const storedCart = cartItems.filter(entry => (entry.product?.persist !== false))
        localStorage.setItem("cartItems", JSON.stringify(storedCart));
        if (campaignInstance) {
            const itemsBefore = cartItems.reduce((sum, entry) =>
                sum + entry.quantity, 0
            )
            const validateCart = async () => {
                try {
                    await campaignInstance.run(cartItems)
                } catch (e) {
                    toast(e.message, 2000)
                }
            }
            validateCart()
            const itemsAfter = cartItems.reduce((sum, entry) =>
                sum + entry.quantity, 0
            )
            if (itemsBefore !== itemsAfter) {
                refreshCart()
            }
        }
    }, [cartItems]);

    function addToCart(product) {

        setCartItems(items => {
            const exists = items.find(item => item.product.id === product.id)

            if (exists) {
                return items.map(item => item.product.id === product.id ?
                    {...item, quantity: item.quantity + 1} : item)
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
                {...item, quantity: item.quantity - 1} : item)
                .filter(item => item.quantity > 0)
        )
    }

    function refreshCart() {
        setCartItems([...cartItems])
    }

    function CalculateSum() {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
    }

    return (
        <Context.Provider value={{addToCart, removeFromCart, CalculateSum, cartItems, refreshCart}}>
            {children}
        </Context.Provider>
    )
}

export function getCart() {
    return useContext(Context)
}
