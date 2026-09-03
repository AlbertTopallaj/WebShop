import "./PriceCalculatorUI.css";

export default function PriceCalculatorUI({ includeVAT, setIncludeVAT }) {
    return (
        <div className="price-calculator-ui">
            <div className="vat-toggle">
                <label className="vat-label">
                    <input
                        type="checkbox"
                        checked={includeVAT}
                        onChange={() => setIncludeVAT(!includeVAT)}
                    />
                    Visa priser med moms
                </label>
            </div>
        </div>
    );
}