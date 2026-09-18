    import { useEffect, useState } from "react";
    import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";
    import "./OrderTotal.css"

        export default function OrderTotal({cart}) {
            const { currency, convertCart } = useCurrency();
            const [total, setTotal] = useState(null);
            const [totalExTax, setTotalExTax] = useState(null);

            useEffect(() => {
                async function convert(){
                    const products = cart.map(item => item.product);
                    const result = await convertCart(products);
                    if (result) 
                        setTotal(result.total);
                        const exTax = result.items.reduce((sum, item) => sum + item.amountExTax, 0);
                        setTotalExTax(`${exTax.toFixed(2)} ${currency}`);
                }
                convert();
            }, [currency]);
            
            return <div className="order-total"> 
            <strong>{totalExTax ?? "..."} without TAX</strong>
            <strong>{total ?? "..."} with TAX</strong>
            </div>

            
        }