import Cart from "../Cart/Cart.jsx";
import "./Header.css"
import {useNavigate} from "react-router";
import UserIcon from "../UserIcon/UserIcon.jsx";
import VATToggle from "../VAT/VATToggle.jsx";
import CurrencySelector from "../Currency/CurrencySelector.jsx";

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
            <HomeBtn/>
            <div className="header-right">

                <div className="vat-currency">
                <VATToggle/>
                <CurrencySelector/>
                </div>

                <UserIcon/>
                <Cart/>
            </div>
        </div>
    )
}