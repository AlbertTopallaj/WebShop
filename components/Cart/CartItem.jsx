import "./CartItem.css"

export default function CartItem({item, remove}) {
    console.log(item.product);
    return (
        <div className="cart-item">
            <span className="cart-item-name">{item.product.title}</span>
            <span className="cart-item-price">{item.product.price}</span>
            <span className="cart-item-qty">Quantity: {item.quantity}</span>

            <button className="cart-item-remove" onClick={() => remove(item.product)}>
                ×
            </button>
        </div>
    )
}