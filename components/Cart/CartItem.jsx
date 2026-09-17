    import { useEffect, useState } from "react";
    import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";
    import "./CartItem.css"
    import { useVAT } from "../VAT/VATContext.jsx";

    export default function CartItem({item, remove}) {
        const { currency, convertCart } = useCurrency();
        const [convertedPrice, setConvertedPrice] = useState(item.product.price);
        const { includeVAT } = useVAT();
        const [ taxRate, setTaxRate ] = useState(null);
        const [ priceExTax, setPriceExTax ] = useState(null);

        useEffect(() => {
            async function convert() {
                const result = await convertCart([item.product]);
                if (result) {
                    setConvertedPrice(result.items[0].price);
                    setPriceExTax(result.items[0].priceExTax);
                    setTaxRate(result.items[0].taxRate);
                }
            }
            convert();
        }, [currency]);

        return (
            <div className="cart-item">
                <span className="cart-item-name">{item.product.name}</span>
                <span className="cart-item-price">{priceExTax} without TAX</span>
                {includeVAT && <span>{convertedPrice} including {taxRate}% TAX</span>}
                <span className="cart-item-qty">Quantity: {item.quantity}</span>

                <button className="cart-item-remove" onClick={() => remove(item.product)}>
                    ×
                </button>
            </div>
        )
    }