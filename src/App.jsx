import './App.css'
import {Header} from "../components/Header/Header.jsx";
import {Route, Routes} from "react-router";
import ProductInfo from "../pages/ProductInfo/ProductInfo.jsx";
import LoadProductList from "../pages/ProductList/ProductList.jsx";
import {CartContext} from "../components/CartContext/CartContext.jsx";
import UserInfo from "../pages/UserInfo/UserInfo.jsx";
import {Toast} from "../components/Toast/Toast.jsx";
import {VATProvider} from "../components/VAT/VATContext.jsx";

export default function App() {

    return (
        <VATProvider>
        <>
            <CartContext>
                <Toast>
                    <Header/>
                    <Routes>
                        <Route index={true} path={"/"} element={<LoadProductList/>}/>
                        <Route path={"/product/"} element={<ProductInfo/>}/>
                        <Route path={"/user/"} element={<UserInfo/>}/>
                    </Routes>
                </Toast>
            </CartContext>
        </>
        </VATProvider>
    )
}

