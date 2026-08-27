import "./CartItem.css"

export default function CartItem({item, remove}) {
    return (
        <div className="cart-item">
            <span className="cart-item-name">{item.product.name}</span>
            <span className="cart-item-price">{item.product.price}</span>
            <span className="cart-item-qty">Quantity: {item.quantity}</span>

            <button className="cart-item-remove" onClick={() => remove(item.product)}>
                ×
            </button>
        </div>
    )
}