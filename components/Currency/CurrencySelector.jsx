import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";

export default function CurrencySelector() {
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