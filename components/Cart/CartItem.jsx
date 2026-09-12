import { useEffect, useState } from "react";
import { useCurrency } from "../../modules/albert/currency/CurrencyContext";
import "./CartItem.css"

export default function CartItem({item, remove}) {
    const { currency, convertCart } = useCurrency();
    const [convertedPrice, setConvertedPrice] = useState(item.product.price);

    useEffect(() => {
        async function convert() {
            const result = await convertCart([item.product]);
            if (result) setConvertedPrice(result.items[0].price);
         }
         convert();
    }, [currency]);

    return (
        <div className="cart-item">
            <span className="cart-item-name">{item.product.name}</span>
            <span className="cart-item-price">{convertedPrice}</span>
            <span className="cart-item-qty">Quantity: {item.quantity}</span>

            <button className="cart-item-remove" onClick={() => remove(item.product)}>
                ×
            </button>
        </div>
    )
}