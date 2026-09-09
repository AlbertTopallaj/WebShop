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
    
    const {cartItems, CalculateSum, removeFromCart} = getCart()

    const [shippingModule] = useState(
        () => new ShippingModule()
    );

    const [country, setCountry] = useState("Sweden");
    const [postalCode, setPostalCode] = useState("");
    const [shippingQuotes, setShippingQuotes] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState(null);

    useEffect(() => {

        async function calculateShipping() {

            if (!country || !postalCode || cartItems.length === 0) {
                setShippingQuotes([]);
                setSelectedShipping(null);
                return;
            }

            setShippingLoading(true);
            setShippingError(null);

            const result = await shippingModule.run(
                {
                    country: country,
                    postal_code: postalCode
                },
                {
                    cartItems: cartItems
                }
            );

            if (result.error) {
                setShippingError(result.message);
                setShippingQuotes([]);
                setSelectedShipping(null);
            } else {
                setShippingQuotes(result);

                // FRAGTMODUL: Det billigaste alternativet
                // ligger först eftersom modulen sorterar resultatet.
                setSelectedShipping(result[0]);
            }

            setShippingLoading(false);
        }

        calculateShipping();

    }, [
        country,
        postalCode,
        cartItems,
        shippingModule
    ]);


    function handleShippingChange(quote) {
        setSelectedShipping(quote);
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
    
    const itemsTotal = Number(CalculateSum());

    const shippingPrice = selectedShipping
        ? selectedShipping.price
        : 0;

    const total = itemsTotal + shippingPrice;

    return (
        <div className="cart">
            <button className="cart-button" onClick={() => setIsOpen(!isOpen)}>
                🛒
                {cartItems.length > 0 && (
                    <span className="cart-count">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
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
                                            key={item.id}
                                            item={item}
                                            remove={removeFromCart}
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

            {shippingQuotes.map(quote => (

                <label
                    key={quote.carrierId}
                    className="shipping-option"
                >

                    <input
                        type="radio"
                        name="shipping"
                        value={quote.carrierId}
                        checked={
                            selectedShipping?.carrierId ===
                            quote.carrierId
                        }
                        onChange={() =>
                            handleShippingChange(quote)
                        }
                    />

                    <span>
                        {quote.carrierName}
                    </span>

                    <span>
                        {quote.price.toFixed(2)} kr
                    </span>

                </label>

            ))}

        </div>
    )}


                                    <div className="cart-freight">
                                        <span>Freight</span>
                                        <span> --- </span>
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
