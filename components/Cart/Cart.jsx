import "./Cart.css"
import {useState} from "react";
import CartItem from "./CartItem.jsx";
import {getCart} from "../CartContext/CartContext.jsx";
import {getModules} from "../../scripts/ModuleRegistry.js";
import ModuleForm from "../ModuleForm/ModuleForm.jsx";
import Campaign from "../../modules/campaign/index.js";

export default function Cart() {

    const [isOpen, setIsOpen] = useState(false)

    const {cartItems, CalculateSum, removeFromCart} = getCart()
    const modules = getModules()
    const context = {cartItems}

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

                                    <div className="moduleContainer">
                                        {/* Dynamically loaded module forms */
                                            modules.map(module => {
                                                return <ModuleForm
                                                    key={module.descriptor.name}
                                                    module={module}
                                                    context={context}/>
                                            })
                                        }

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