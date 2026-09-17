import { useState } from "react";
import { useVAT } from "../../components/VAT/VATContext";
import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext";

export default function OrderItem({ item }) {
    const { currency, convertCart } = useCurrency();
    const { includeVAT } = useVAT();
    const { convertedPrice, setConvertedPrice } = useState(null);
    const { priceExTax, setPriceExTax } = useState(null);
    const [ taxRate, setTaxRate ] = useState(null);
}