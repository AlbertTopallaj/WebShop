import './App.css'
import Cart from "../components/Cart/Cart.jsx";
import {addToCart, removeFromCart} from "../components/Cart/CartFunctions.js";
import {useState} from "react";
import LoadProductList from "../components/Products/ProductList.jsx";

export default function App() {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])


    return (
        <>
            <Cart cartItems={cartItems} remove={(product) => removeFromCart(setCartItems, product)}/>

            <LoadProductList products={products} setProducts={setProducts}
                             add={(product) => addToCart(setCartItems, product)}/>
        </>
    )
}

