import "./Cart.css"
import {useState, useEffect} from "react";
import CartItem from "./CartItem.jsx";
import {getCart} from "../CartContext/CartContext.jsx";
import {postOrder} from "../../scripts/OrderData.js";
import { Toast, useToast } from "../Toast/Toast.jsx";
import ShippingModule from "../../modules/ShippingCalculator/index.js";


export default function Cart() {

    const [isOpen, setIsOpen] = useState(false)
    const [discountCode, setDiscountCode] = useState([])
    const [email, setEmail] = useState("");
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const { toast } = useToast()
    
    const {
    cartItems,
    CalculateSum,
    removeFromCart,
    setShipping,
    removeShipping
} = getCart();

console.log("Cart context:", {
    cartItems,
    setShipping,
    removeShipping
});
    

    const [shippingModule] = useState(
        () => new ShippingModule()
    );

    const [country, setCountry] = useState("Sweden");
    const [postalCode, setPostalCode] = useState("");
    const [shippingQuotes, setShippingQuotes] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState(null);

    const productCartItems = cartItems.filter(
        item => !item.isShipping
    );

    const productCartKey =
        JSON.stringify(productCartItems);

    useEffect(() => {

    async function calculateShipping() {

        if (
            !country ||
            !postalCode ||
            productCartItems.length === 0
        ) {
            setShippingQuotes([]);
            setSelectedShipping(null);
            removeShipping();
            setShippingLoading(false);
            return;
        }

        setShippingLoading(true);
        setShippingError(null);

        try {
            const result = await shippingModule.run(
                {
                    country,
                    postal_code: postalCode
                },
                {
                    cartItems: productCartItems
                }
            );

            if (result.error) {
                setShippingError(result.message);
                setShippingQuotes([]);
                setSelectedShipping(null);
                removeShipping();
                return;
            }

            setShippingQuotes(result);

            const cheapest = result[0];

            setSelectedShipping(cheapest);
            setShipping(cheapest);

        } catch (error) {
            console.error("Shipping calculation failed:", error);

            setShippingError(
                error instanceof Error
                    ? error.message
                    : "Kunde inte beräkna frakt."
            );

            setShippingQuotes([]);
            setSelectedShipping(null);
            removeShipping();

        } finally {
            setShippingLoading(false);
        }
    }

    calculateShipping();

}, [
    country,
    postalCode,
    productCartKey
]);


    function handleShippingChange(quote) {

        setSelectedShipping(quote);

        setShipping(quote);
    }


    async function handlePlaceOrder() {
        const success = await postOrder(email, cartItems)
        if (success) {
            toast("Order placed!", 2000);
            setIsOpen(false);
        } else {
                toast("Something went wrong, try again", 2000);
            }
        }

    const total = Number(CalculateSum());

    return (
        <div className="cart">
            <button className="cart-button" onClick={() => setIsOpen(!isOpen)}>
                🛒
                {cartItems.length > 0 && (
                    <span className="cart-count">
                        {cartItems
                            .filter(
                                item => !item.isShipping
                            )
                            .reduce(
                                (total, item) =>
                                    total + item.quantity,
                                0
                            )}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="cart-overlay" onClick={() => setIsOpen(false)}>
                    <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="cart-close" onClick={() => setIsOpen(false)}>
                            ×
                        </button>
                        <h2>Your Cart</h2>

                        {cartItems.length === 0 ? (
                            <p>Your cart is empty.</p>) : (
                            <>
                                <div className="cart-items">
                                    {cartItems.map(item => (
                                        <CartItem
                                            key={
                                                item.product.id
                                            }

                                            item={item}

                                            remove={
                                                removeFromCart
                                            }
                                        />
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div className="cart-sum">
                                        <span>Items</span>
                                        <span>{CalculateSum(cartItems)}</span>
                                    </div>

                                    <div className="cart-discount-code">
                                        <span className="discount-label">Discount Code</span>

                                        <div className="discount-input-row">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                            />
                                            <button type="button">
                                                Add
                                            </button>
                                        </div>

                                        <span className="discount-value">
                                            {discountCode.length > 0 ?
                                                discountCode.map(discount => (
                                                    <div>
                                                        Discount: {discount.code} -{discount.discount.toFixed(2)}
                                                    </div>
                                                ))
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="mail">
                                        <span className="mail-label">Mail</span>
                                        <input className='mail-input' type="mail" placeholder="your@mail.com"
                                             onChange={(e) => setEmail(e.target.value)} value={email}></input>
                                    </div>

                                    <div className="cart-country">

                                        <label>
                                            Country
                                        </label>

                                        <select
                                            value={country}
                                            onChange={(e) =>
                                                setCountry(e.target.value)
                                            }
                                        >

                                            <option value="Sweden">
                                                Sweden
                                            </option>

                                            <option value="Norway">
                                                Norway
                                            </option>

                                            <option value="Finland">
                                                Finland
                                            </option>

                                            <option value="Denmark">
                                                Denmark
                                            </option>

                                            <option value="Germany">
                                                Germany
                                            </option>

                                            <option value="USA">
                                                USA
                                            </option>

                                        </select>

                                    </div>
                                    
                                    <div className="cart-postal-code">

                                        <label>
                                            Postal code
                                        </label>

                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) =>
                                                setPostalCode(e.target.value)
                                            }
                                            placeholder="111 22"
                                        />

                                    </div>

                                    {!shippingLoading &&
                                        shippingQuotes.length > 0 && (

                                            <div className="shipping-options">

                                                {shippingQuotes.map(
                                                    quote => (

                                                        <label
                                                            key={
                                                                quote.carrierId
                                                            }
                                                            className="shipping-option"
                                                        >

                                                            <input
                                                                type="radio"
                                                                name="shipping"
                                                                value={
                                                                    quote.carrierId
                                                                }
                                                                checked={
                                                                    selectedShipping?.carrierId ===
                                                                    quote.carrierId
                                                                }
                                                                onChange={() =>
                                                                    handleShippingChange(
                                                                        quote
                                                                    )
                                                                }
                                                            />


                                                            <span>
                                                                {
                                                                    quote.carrierName
                                                                }
                                                            </span>


                                                            <span>
                                                                {
                                                                    quote.price.toFixed(
                                                                        2
                                                                    )
                                                                }
                                                                {" "}
                                                                kr
                                                            </span>

                                                        </label>

                                                    )
                                                )}

                                            </div>
                                        )
                                    }


                                    <div className="cart-freight">
                                        <span>Freight</span>
                                        <span> {selectedShipping
                                                ? `${selectedShipping.price.toFixed(2)} kr`
                                                : "---"
                                            } </span>
                                    </div>

                                    {shippingLoading && (
                                        <p>
                                            Calculating shipping...
                                        </p>
                                    )}

                                    {shippingError && (
                                        <p>
                                            {shippingError}
                                        </p>
                                    )}


                                    <div className="cart-subtotal">
                                        <span>Subtotal</span>
                                        <span> {total.toFixed(2)} kr </span>
                                    </div>

                                    <button disabled={!isValidEmail} className="order-button" onClick={handlePlaceOrder}>
                                        Place Order
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
