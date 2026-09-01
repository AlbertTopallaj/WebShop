import Cart from "../Cart/Cart.jsx";
import {removeFromCart} from "../Cart/CartFunctions.js";
import "./Header.css"
import {useNavigate} from "react-router";

function HomeBtn() {
    const navigate = useNavigate()
    return (
        <button className="homeBtn" onClick={() => navigate("/")}>
            🏠︎
        </button>
    )
}

export function Header({cartItems, setCartItems}) {
    return (
        <div className="header">
            <HomeBtn />
            <Cart cartItems={cartItems} remove={(product) => removeFromCart(setCartItems, product)}/>
        </div>
    )
}