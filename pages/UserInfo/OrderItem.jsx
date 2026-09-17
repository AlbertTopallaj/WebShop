import { useState } from "react";
import { useVAT } from "../../components/VAT/VATContext";
import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";

export default function OrderItem({ item }) {
    const { currency, convertCart } = useCurrency();
    const { includeVAT } = useVAT();
    const { convertedPrice, setConvertedPrice } = useState(null);
    const { priceExTax, setPriceExTax } = useState(null);
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

}