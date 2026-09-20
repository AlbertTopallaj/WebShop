import "./VATToggle.css";
import { useVAT } from "./VATContext.jsx";

export default function VATToggle() {
    const { includeVAT, setIncludeVAT } = useVAT();

    return (
        <div className="vat-toggle-container">
            <label className="vat-toggle-label">
                TAX {includeVAT ? "ON" : "OFF"}
            </label>

            <label className="vat-switch">
                <input
                    type="checkbox"
                    checked={includeVAT}
                    onChange={(e) => setIncludeVAT(e.target.checked)}
                />
                <span className="vat-slider"></span>
            </label>
        </div>
    );
}