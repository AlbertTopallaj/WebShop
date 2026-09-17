import { useEffect, useState } from "react";
import { useCurrency} from "../../src/modules/albert/currency/CurrencyContext";

    export function OrderTotal({cart}) {
        const { currency, convertCart } = useCurrency();
        const [total, setTotal] = useState(null);

        useEffect(() => {
            async function convert(){
                const products = cart.map(item => item.product);
                const result = await convertCart(products);
                if (result) setTotal(result.total);
            }
            convert();
        }, [currency]);
        
        return <strong>{total ?? "..."}</strong>
    }