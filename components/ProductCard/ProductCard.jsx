import "./ProductCard.css"
import {Link} from "react-router";
import {getCart} from "../CartContext/CartContext.jsx";
import {useToast} from "../Toast/Toast.jsx";

export default function ProductCard({product}) {

    const {addToCart} = getCart()
    const {toast} = useToast()

    function add(product) {
        addToCart(product);
        toast(`${product.name} was added to cart!`)
    }

    return (
        <>
            <div className="product-card" id={product.id}>
                <Link to={`/product?id=${product.id}`}>
                    <img src={product.img[0]} alt={product.name}/>
                    <div className="product-info">
                        <h2>{product.name}</h2> <p>{product.price}</p>
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