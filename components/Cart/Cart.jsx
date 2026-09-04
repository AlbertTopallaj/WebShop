import "./Cart.css"
import {useState} from "react";
import CartItem from "./CartItem.jsx";
import {getCart} from "../CartContext/CartContext.jsx";


export default function Cart() {

    const [isOpen, setIsOpen] = useState(false)
    const [discountCode, setDiscountCode] = useState([])

    const {cartItems, CalculateSum, removeFromCart} = getCart()

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
                                        <input className='mail-input' type="mail" placeholder="your@mail.com"></input>
                                    </div>


                                    <div className="cart-freight">
                                        <span>Freight</span>
                                        <span> --- </span>
                                    </div>

                                    <div className="cart-subtotal">
                                        <span>Subtotal</span>
                                        <span> --- </span>
                                    </div>

                                    <button className="order-button">
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