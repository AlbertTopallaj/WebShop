/*import {createContext, useContext, useEffect, useState} from "react";

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

    function setShipping(quote) {
    setCartItems(items => {

        const itemsWithoutShipping =
            items.filter(
                item => !item.isShipping
            );

        const shippingItem = {
            product: {
                id: `shipping-${quote.carrierId}`,
                title: `Frakt - ${quote.carrierName}`,
                price: quote.price
            },

            quantity: 1,
            isShipping: true
        };

        return [
            ...itemsWithoutShipping,
            shippingItem
        ];
    });
}

    function removeShipping() {

        setCartItems(items =>
            items.filter(
                item => !item.isShipping
            )
        );
    }

    return (
        <Context.Provider value={{addToCart, removeFromCart, CalculateSum, cartItems, setShipping, removeShipping}}>
            {children}
        </Context.Provider>
    )
}

export function getCart() {
    return useContext(Context)
}*/


import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const Context = createContext(null);

export function CartContext({ children }) {

    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "cartItems",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    function addToCart(product) {
        setCartItems(items => {

            const exists = items.find(
                item =>
                    !item.isShipping &&
                    item.product.id === product.id
            );

            if (exists) {
                return items.map(item =>
                    !item.isShipping &&
                    item.product.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...items,
                {
                    product,
                    quantity: 1
                }
            ];
        });
    }

    function removeFromCart(product) {
        setCartItems(items =>
            items
                .map(item =>
                    !item.isShipping &&
                    item.product.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    }

    function CalculateSum() {
        return cartItems
            .reduce(
                (total, item) =>
                    total +
                    item.product.price * item.quantity,
                0
            )
            .toFixed(2);
    }

    function setShipping(quote) {
        setCartItems(items => {

            const productsOnly = items.filter(
                item => !item.isShipping
            );

            const shippingItem = {
                product: {
                    id: `shipping-${quote.carrierId}`,
                    title: `Frakt - ${quote.carrierName}`,
                    price: quote.price
                },
                quantity: 1,
                isShipping: true
            };

            return [
                ...productsOnly,
                shippingItem
            ];
        });
    }

    function removeShipping() {
        setCartItems(items =>
            items.filter(
                item => !item.isShipping
            )
        );
    }

    return (
        <Context.Provider
            value={{
                addToCart,
                removeFromCart,
                CalculateSum,
                cartItems,
                setShipping,
                removeShipping
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function getCart() {
    const context = useContext(Context);

    if (!context) {
        throw new Error(
            "getCart() måste användas innanför <CartContext>."
        );
    }

    return context;
}