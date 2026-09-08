import "./UserInfo.css"
import {useEffect, useState} from "react"
import {getUserData} from "../../scripts/OrderData.js";
import {useSearchParams} from "react-router";

export default function UserInfo() {

    const [searchParams] = useSearchParams()
    const email = searchParams.get("email")

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            const data = await getUserData(email)

            if (data === false) {
                setOrders([])
            } else {
                setOrders(data)
                setLoading(false)
            }
        }
        fetchOrders()
    }, [email])

    return (
        <div className="user-info">
            <div className="user-info-header">
                <div>
                    <h1>{email}</h1>
                </div>
            </div>

            <div className="orders-section">
                <h2>Order History</h2>

                {loading ? (
                    <p className="orders-message">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div className="orders-empty">
                        <span className="empty-icon">🛍️</span>
                        <h3>No orders yet</h3>
                        <p>Your orders will appear here once you place one.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <div className="order-card" key={order.id ?? index}>
                                <div className="order-header">
                                    <div>
                                        <span className="order-label">Order</span>
                                        <h3>#{order.id ?? index + 1}</h3>
                                    </div>

                                    <span className="order-date">
                                        {new Date(order.date).toLocaleDateString(
                                            undefined,
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            }
                                        )}
                                    </span>
                                </div>

                                <div className="order-products">
                                    {order.cart.map((item, productIndex) => (
                                        <div
                                            className="order-product"
                                            key={item.product?.id ?? productIndex}
                                        >
                                            <div className="product-image">
                                                {item.product?.img ? (
                                                    <img
                                                        src={item.product.img}
                                                        alt={item.product.name}
                                                    />
                                                ) : (
                                                    "🛍️"
                                                )}
                                            </div>

                                            <div className="product-info">
                                                <span className="product-name">
                                                    {item.product?.name}
                                                </span>

                                                <span className="product-quantity">
                                                    Quantity: {item.quantity}
                                                </span>
                                            </div>

                                            <span className="product-price">
                                                {item.product?.price != null
                                                    ? `${(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)}`
                                                    : "---"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <span>
                                        {order.cart.reduce(
                                            (total, item) => total + item.quantity, 0)}{" "}
                                        items
                                    </span>

                                    <strong>
                                        {order.cart.reduce(
                                                (total, item) => total + (item.product?.price ?? 0) * item.quantity, 0)
                                            .toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}