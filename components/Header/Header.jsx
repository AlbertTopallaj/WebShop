import Cart from "../Cart/Cart.jsx";
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

export function Header() {
    return (
        <div className="header">
            <HomeBtn />
            <Cart />
        </div>
    )
}