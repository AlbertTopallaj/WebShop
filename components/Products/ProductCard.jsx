import "./ProductCard.css"
import {useState} from "react";

export default function ProductCard({product, addToCart}) {

    const [showToast, setShowToast] = useState(false)

    function add(product) {
        addToCart(product);

        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 1000);
    }

    return (
        <>
            {showToast && (
                <div className="toast">
                   {product.name} was added to cart!
                </div>
            )}
            <div className="product-card" id={product.id}><img src={product.img[0]} alt={product.name}/>
                <div className="product-info">
                    <h2>{product.name}</h2> <p>{product.price}</p>
                    <button onClick={() => {
                        add(product)
                    }}>
                        Add to cart
                    </button>
                </div>
            </div>
        </>
    )
}