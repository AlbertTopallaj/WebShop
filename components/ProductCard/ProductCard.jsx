import "./ProductCard.css"
import {Link} from "react-router";
import {getCart} from "../CartContext/CartContext.jsx";
import {useToast} from "../Toast/Toast.jsx";
import { useEffect, useState } from "react";
import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext.jsx" 
import { useVAT } from "../VAT/VATContext.jsx"

export default function ProductCard({product}) {

    const { includeVAT } = useVAT();
    const [ taxRate, setTaxRate ] = useState(null);
    const {addToCart} = getCart()
    const {toast} = useToast()
    const {currency, convertCart} = useCurrency();
    const [convertedPrice, setConvertedPrice] = useState(product.price);
    const [priceExTax, setPriceExTax] = useState(null);

    useEffect(() => {
        async function convert() {
            const result = await convertCart([product]);
            if(result) {
                setConvertedPrice(result.items[0].price);
                setTaxRate(result.items[0].taxRate);
                setPriceExTax(result.items[0].priceExTax);
            }
        } 
        convert();
    }, [currency]);

    function add(product) {
        addToCart(product);
        toast(`${product.name} was added to cart!`)
    }

    return (
        <>
            <div className="product-card" id={product.id}>
                <Link to={`/product?id=${product.id}`}>
                    <img src={product.img[0]} alt={product.name}/>
                    <div className="product-card-content">
                        <h2>{product.name}</h2>
                         <p>{priceExTax} without TAX</p>
                        {includeVAT && <p>{convertedPrice} including {taxRate}% TAX</p>}
                        {typeof product?.discountPercentage === 'string' && (
                            <p className="discount-label">
                                {
                                    `${product.discountPercentage.valueOf() * 100}% off`
                                }
                            </p>
                        )}
                    </div>
                </Link>
                <button className="buyBtn" onClick={() => {
                    add(product)
                }}>
                    Add to cart
                </button>
            </div>
        </>
    )
}
