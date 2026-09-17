import { useState } from "react";
import modules from "../../src/modules/moduleMaker.js";
import { getCart } from "../CartContext/CartContext.jsx";
import "./ShippingOptions.css";

function ShippingOptions() {
const { cartItems, addToCart } = getCart();

const [country, setCountry] = useState("Sweden");
const [postalCode, setPostalCode] = useState("");
const [loading, setLoading] = useState(false);
const [quotes, setQuotes] = useState([]);
const [error, setError] = useState("");

async function handleCalculate() {
console.log("ShippingOptions: handleCalculate triggered");
setLoading(true);
setError("");
setQuotes([]);

try {
  const result = await modules.ShippingCalculator.run(
    { country, postal_code: postalCode },
    { cartItems }
  );

  if (result[0]?.error) {
    setError(result[0].message);
  } else {
    setQuotes(result);
  }
} catch (err) {
  setError(err.message);
}

setLoading(false);

}

function chooseCarrier(quote) {
  addToCart({
    id: "shipping",
    name: `Frakt (${quote.carrierName})`,
    price: Number(quote.price.toFixed(2)),
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0
    }
  });

  setQuotes([]);
}

return (
<div className="shipping-options">
<h3>Shipping</h3>

  <div className="shipping-inputs">
    <label>
      Country:
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <option>Sweden</option>
        <option>Norway</option>
        <option>Finland</option>
        <option>Denmark</option>
        <option>Germany</option>
        <option>USA</option>
      </select>
    </label>

    <label>
      Postal number:
      <input
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        placeholder="12345"
      />
    </label>

    <button onClick={handleCalculate} disabled={loading || !postalCode}>
      {loading ? "Calculating..." : "Order shipping"}
    </button>
  </div>

  {error && <p className="shipping-error">{error}</p>}

  {quotes.length > 0 && (
    <div className="shipping-results">
      <h4>Choose shipping company</h4>

      {quotes.map((quote) => (
        <button
          key={quote.carrierId}
          className="shipping-option-btn"
          onClick={() => chooseCarrier(quote)}
        >
          {quote.carrierName} – {quote.price.toFixed(2)} kr
        </button>
      ))}
    </div>
  )}
</div>

);
}

export default ShippingOptions;