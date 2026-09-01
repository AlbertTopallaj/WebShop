import './App.css'
import {Header} from "../components/Header/Header.jsx";
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router";
import ProductInfo from "../pages/ProductInfo.jsx";
import {addToCart} from "../components/Cart/CartFunctions.js";
import LoadProductList from "../components/Products/ProductList.jsx";

export default function App() {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);


    return (
        <>
            <Header cartItems={cartItems} setCartItems={setCartItems}/>

            <Routes>
                <Route index={true} path={"/"}
                       element={<LoadProductList products={products} setProducts={setProducts}
                                      addProduct={(product) => addToCart(setCartItems, product)}/>}/>
                <Route path={"/product/"} element={<ProductInfo
                    addProduct={(product) => addToCart(setCartItems, product)} products={products} />}/>
            </Routes>

        </>
    )
}

