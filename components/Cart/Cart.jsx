import "./Cart.css"
import { useState, useEffect } from "react";
import CartItem from "./CartItem.jsx";
import {getCart} from "../CartContext/CartContext.jsx";
import {postOrder} from "../../scripts/OrderData.js";
import { useCurrency } from "../../src/modules/albert/currency/CurrencyContext.jsx";
import CurrencySelector from "../Currency/CurrencySelector.jsx";
import ShippingOptions from "./ShippingOptions.jsx";
import {useToast} from "../Toast/Toast.jsx";
import {getModules} from "../../scripts/ModuleRegistry.js";
import ModuleForm from "../ModuleForm/ModuleForm.jsx";
import StockModule from "../../src/modules/stockmodule/index.js";
import VATToggle from "../VAT/VATToggle.jsx";

export default function Cart() {

    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("");
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const { toast } = useToast()
    const { currency, convertCart } = useCurrency();
    const [ convertedTotal, setConvertedTotal ] = useState(null);
    const [ convertedTotalExTax, setConvertedTotalExTax ] = useState(null);
    const {cartItems, CalculateSum, removeFromCart} = getCart()
    const freightItem = cartItems.find(item => item.product.id === "shipping");
    const freightCost = freightItem ? freightItem.product.price.toFixed(2) : null;
    const modules = getModules()
    const context = {cartItems}
    const stockModule = modules.find(m => m === StockModule).instance
    
    useEffect(() => {
        async function convert() {
            if (cartItems.length === 0) return;

            const productsWithQuantity = cartItems.flatMap(item =>
                Array(item.quantity).fill(item.product)
            );

            const result = await convertCart(productsWithQuantity);

            if (result) {
                setConvertedTotal(result.total);
                const exTax = result.items.reduce((sum, item) => sum + item.amountExTax, 0);
                setConvertedTotalExTax(`${exTax.toFixed(2)} ${currency}`);

            }
        }

    convert();
    }, [currency, cartItems]);
    
    

    async function handlePlaceOrder() {
        const success = await postOrder(email, cartItems)
        if (success) {
            if (stockModule) {
                try {
                    cartItems.forEach(item => {
                        if (item.product.id !== "shipping" && !item.product.isDiscount) stockModule.removeFromStock(item.product.id, item.quantity)                
                    });
                } catch(e) {
                    throw new Error(e)
                }
            }
            toast("Order placed!", 2000);
            setIsOpen(false);
            clearCart();
        } else {
            toast("Something went wrong, try again", 2000);
        }
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
                            <div className="currency-selector">
                            <CurrencySelector/>
                            </div>
                            <VATToggle/>   
                            <h2>Your Cart</h2>

                            {cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>) : (
                                <>
                                    <div className="cart-items">
                                        {cartItems.map(item => (
                                            <CartItem
                                                key={item.product.id}
                                                item={item}
                                                remove={removeFromCart}
                                            />
                                        ))}
                                    </div>

                                    <div className="cart-summary">
                                        <div className="cart-sum">
                                            <span>Subtotal without TAX</span>
                                            <span>{convertedTotalExTax ?? CalculateSum()}</span>
                                        </div>
                                        <div className="cart-sum">
                                            <span>Subtotal with TAX</span>
                                            <span>{convertedTotal ?? CalculateSum()}</span>
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


                                        <div className="mail">
                                            <span className="mail-label">Mail</span>
                                            <input className='mail-input' type="mail" placeholder="your@mail.com"
                                                onChange={(e) => setEmail(e.target.value)} value={email}></input>
                                        </div>

                                        <ShippingOptions />

                                        <div className="cart-subtotal">
                                            <span>Total</span>
                                            <span>{convertedTotal ?? `${CalculateSum()} SEK`}</span>
                                        </div>

                                        <button className="order-button" disabled={!isValidEmail || !freightItem}
                                                onClick={() => handlePlaceOrder()}>
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