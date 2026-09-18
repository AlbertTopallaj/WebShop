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
                        const totalWithTax = result.items[0].amount * item.quantity;
                        const totalExTax = result.items[0].amountExTax * item.quantity;
                        setConvertedPrice(`${totalWithTax.toFixed(2)} ${currency}`);
                        setPriceExTax(`${totalExTax.toFixed(2)} ${currency}`);
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
                    ) : item.product?.name?.startsWith("Frakt") ? (
                        <i className="fa-solid fa-truck"></i>
                    ) : (
                        <i className="fa-solid fa-tag"></i>
                    )}
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