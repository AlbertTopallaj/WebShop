import {createContext, useContext, useEffect, useState} from "react";
import {getModules} from "../../scripts/ModuleRegistry.js";
import {useToast} from "../Toast/Toast.jsx";
import Product from "../ProductCard/Product.js";
import Campaign from "../../src/modules/campaign/index.js";

const Context = createContext(null);

export function CartContext({children}) {

    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems")
        if (!saved) return []

        const parsed = JSON.parse(saved)
        try {
            return parsed.map(entry => ({
                ...entry,
                product: new Product(
                    entry.product.id,
                    entry.product.name,
                    entry.product.price,
                    entry.product.img,
                    entry.product.weight,
                    entry.product.dimensions,
                    entry.product.stock,
                    entry.product.category,
                    entry.product.discountPercentage
                )
            }))
        } catch (_) {
            // Local data malformed, skip
            localStorage.removeItem("cartItems");
            return []
        }
    });

    const {toast} = useToast()

    const campaignInstance = getModules().find(module => module === Campaign)?.instance

    useEffect(() => {
        if (campaignInstance) {
            const validateCart = async () => {
                try {
                    const discountBefore = cartItems
                        .filter(entry => (entry.product?.isDiscount === true))
                        .reduce((sum, entry) => sum + entry.product.price, 0)

                    const {context, message} = await campaignInstance.run(cartItems)

                    if (!context || !Array.isArray(context)) return

                    const discountAfter = context
                        .filter(entry => (entry.product?.isDiscount === true))
                        .reduce((sum, entry) => sum + entry.product.price, 0)

                    if (discountBefore !== discountAfter) {
                        if (message) toast(message, 2000)
                        refreshCart(context)
                    }
                } catch (e) {
                    toast(e.message, 2000)
                }
            }
            validateCart()
        }
        const storedCart = cartItems.filter(entry => !(entry.product?.isDiscount === true))
        localStorage.setItem("cartItems", JSON.stringify(storedCart));
    }, [cartItems])

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

    function refreshCart(newCart) {
        if (newCart) setCartItems([...newCart])
        else setCartItems([...cartItems])
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
