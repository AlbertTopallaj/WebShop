import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";
import "./currencySelector.css"

export default function CurrencySelector() {
    const { currency, setCurrency} = useCurrency();

    return <>
    <div className="currencySelector">
        <select value={currency} onChange={(e) => {
            setCurrency(e.target.value)
        }}>
            <option value="USD">USD</option>
            <option value="SEK">SEK</option>
            <option value="EUR">EUR</option>
        </select>
    </div>
    </>

}