import './App.css'
import {Header} from "../components/Header/Header.jsx";
import {Route, Routes} from "react-router";
import ProductInfo from "../pages/ProductInfo.jsx";
import LoadProductList from "../components/Products/ProductList.jsx";
import {CartContext} from "../components/CartContext/CartContext.jsx";
import { VATProvider } from "../components/CartContext/VATContext.jsx";

export default function App() {

    return (
        <>
        <VATProvider>
            <CartContext>
                <Header />
                <Routes>
                    <Route index={true} path={"/"} element={<LoadProductList />}/>
                    <Route path={"/product/"} element={<ProductInfo />}/>
                </Routes>
            </CartContext>
        </VATProvider>

        </>
    )
}
