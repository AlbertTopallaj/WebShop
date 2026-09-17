    import { useVAT } from "../../components/VAT/VATContext";
    import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";
    import { useEffect, useState } from "react";



    export default function OrderItem({ item }) {
        const { currency, convertCart } = useCurrency();
        const { includeVAT } = useVAT();
        const [ convertedPrice, setConvertedPrice ] = useState(null);
        const [ priceExTax, setPriceExTax ] = useState(null);
        const [ taxRate, setTaxRate ] = useState(null);

        useEffect(() => {
            async function convert() {
                if(!item.product) 
                    return;

                const result = await convertCart([item.product]);

                if(result) {
                    setConvertedPrice(result.items[0].price);
                    setPriceExTax(result.items[0].priceExTax);
                    setTaxRate(result.items[0].taxRate);
                }

            }
            convert();
        }, [currency]);

        return <>
        <div className="order-product">
            <div className="product-image">
                {item.product?.img ? (
                    <img src={item.product.img[0]} alt={item.product.name}/>
                ) : item.product?.name}
            </div>
            <div className="product-info">
                <span className="product-name">{item.product?.name}</span>
                <span className="product-quantity">Quantity: {item.quantity}</span>
            </div>
            <span className="product-price">
                <p>{priceExTax} with no TAX</p>
                {includeVAT && <p>{convertedPrice} including {taxRate}% TAX</p>}
            </span>
        </div>
        </>
    }