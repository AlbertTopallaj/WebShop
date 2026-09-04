import Cart from "../Cart/Cart.jsx";
import "./Header.css"
import {useNavigate} from "react-router";
import { useVAT } from "../CartContext/VATContext.jsx";

function HomeBtn() {
    const navigate = useNavigate()
    return (
        <button className="homeBtn" onClick={() => navigate("/")}>
            🏠︎
        </button>
    )
}

export function Header() {
    const { includeVAT, setIncludeVAT } = useVAT();
    return (
        <div className="header">
            <HomeBtn/>
            <label className="vat-toggle">
                <input
                    type="checkbox"
                    checked={includeVAT}
                    onChange={() => setIncludeVAT(!includeVAT)}
                />
                Inkl. moms
            </label>
            <div className="header-right">
                <UserIcon/>
                <Cart/>
            </div>
        </div>
    )
}