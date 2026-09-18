import { useEffect, useState } from "react";
import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";
import "./ShippingQuote.css"

export default function ShippingQuote({ quote, onClick }) {
    const { currency, convertCart } = useCurrency();
    const [ convertedPrice, setConvertedPrice ] = useState(null);

    useEffect(() => {
        async function convert() {
            const result = await convertCart([{
                price: quote.price,
                category: "shipping",
                name: quote.carrierName
            }]);
            if (result) setConvertedPrice(result.items[0].priceExTax);
        }
        convert();
    }, [currency]);

    return (
        <button className="shipping-option-btn" onClick={onClick}>
            {quote.carrierName} -  {convertedPrice ?? quote.price.toFixed(2)} 
        </button>
    );
}