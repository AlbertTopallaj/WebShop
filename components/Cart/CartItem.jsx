    import { useEffect, useState } from "react";
    import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";
    import "./CartItem.css"
    import { useVAT } from "../VAT/VATContext.jsx";
    import {getCart} from "../CartContext/CartContext.jsx";

    export default function CartItem({item, remove}) {
        const { currency, convertCart } = useCurrency();
        const [convertedPrice, setConvertedPrice] = useState(item.product.price);
        const { includeVAT } = useVAT();
        const [ taxRate, setTaxRate ] = useState(null);
        const [ priceExTax, setPriceExTax ] = useState(null);
        const {cartItems} = getCart()

        useEffect(() => {
            async function convert() {
                const result = await convertCart([item.product]);
                if(result) {
                        const totalWithTax = result.items[0].amount * item.quantity;
                        const totalExTax = result.items[0].amountExTax * item.quantity;
                        setConvertedPrice(`${totalWithTax.toFixed(2)} ${currency}`);
                        setPriceExTax(`${totalExTax.toFixed(2)} ${currency}`);
                        setTaxRate(result.items[0].taxRate);
                    }
            }
            convert();
        }, [currency, cartItems]);

        return (
            <div className="cart-item">
                <span className="cart-item-name">{item.product.name}</span>

                <div className="cart-item-price-container">
                {includeVAT ? (
                    <span className="cart-item-price">{convertedPrice}</span>
                ) : ( 
                    <span className="cart-item-price">{priceExTax}</span>
                )}
                <span className="cart-item-tax">TAX{taxRate}%</span>
                </div>
                
                <span className="cart-item-qty">Quantity: {item.quantity}</span>

                <button className="cart-item-remove" onClick={() => remove(item.product)}>
                    ×
                </button>
            </div>
        )
    }