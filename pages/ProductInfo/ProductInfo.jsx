import {useNavigate, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import "./ProductInfo.css"
import Product from "../../components/ProductCard/Product.js";
import {getCart} from "../../components/CartContext/CartContext.jsx";
import {useToast} from "../../components/Toast/Toast.jsx";
import {getInstances} from "../../scripts/ModuleRegistry.js";

export default function ProductInfo() {

    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0);

    const {addToCart} = getCart()
    const {toast} = useToast()

    const campaignInstance = getInstances().find(instance => instance.constructor.descriptor.name === "campaign")

    function getProduct() {
        return new Product(
            product.id,
            product.title,
            product.price,
            product.image,
            product.weight,
            product.dimensions,
            product.stock,
            product.category,
            product.discountPercentage
        )
    }

    useEffect(() => {
        async function fetchProduct() {
            try {
                // Returns an object, not an array
                const res = await fetch(`http://localhost:5050/products/${id}`);
                if (!res.ok) {
                    toast("Server error, try again later")
                    navigate("/");
                }
                const data = await res.json();
                const wrapped = [data]
                if (campaignInstance) await campaignInstance.run(wrapped)
                setProduct(wrapped[0]);
            } catch (e) {
                toast("Server error, try again later")
                navigate("/");
            }
        }

        fetchProduct();
    }, [id])

    if (product === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="product-info">

            {/* Main product section */}
            <section className="product-main">

                {/* Image gallery */}
                <div className="product-gallery">
                    <div className="product-main-image">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.title}
                        />
                    </div>

                    <div className="product-thumbnails">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.title} ${index + 1}`}
                                onClick={() => setSelectedImage(index)}
                                className={selectedImage === index ? "selected" : ""}
                            />
                        ))}
                    </div>
                </div>

                {/* Product summary */}
                <div className="product-summary">

                    <p className="product-category">{product.category}</p>

                    <h1>{product.title}</h1>

                    <div className="product-rating">
                        <span>★</span>
                        <span>{product.rating}</span>
                        <span className="review-count">
                        ({product.reviews.length} reviews)
                    </span>
                    </div>

                    <div className="product-price">
                        ${product.price.toFixed(2)}
                    </div>

                    {typeof product?.discountPercentage === 'string' && (
                        <p className="product-discount">
                            {
                                `${product.discountPercentage.valueOf() * 100}% off`
                            }
                        </p>
                    )}

                    <p className="product-description">
                        {product.description}
                    </p>

                    <div className="product-availability">
                        <span>{product.availabilityStatus}</span>
                        <span>{product.stock} available</span>
                    </div>

                    <button className="buyBtn" onClick={() => {
                        addToCart(getProduct(id))
                        toast(`${product.title} added to cart`)
                    }}>
                        Add to cart
                    </button>

                    <div className="product-shipping">
                        <p>{product.shippingInformation}</p>
                        <p>{product.warrantyInformation}</p>
                    </div>

                </div>
            </section>


            {/* Product details */}
            <section className="product-details">

                <h2>Product details</h2>

                <div className="details-grid">
                    <div>
                        <span>Brand</span>
                        <strong>{product.brand}</strong>
                    </div>

                    <div>
                        <span>SKU</span>
                        <strong>{product.sku}</strong>
                    </div>

                    <div>
                        <span>Weight</span>
                        <strong>{product.weight} g</strong>
                    </div>

                    <div>
                        <span>Dimensions</span>
                        <strong>
                            {product.dimensions.width} ×{" "}
                            {product.dimensions.height} ×{" "}
                            {product.dimensions.depth}
                        </strong>
                    </div>
                </div>

                <div className="product-tags">
                    {product.tags.map(tag => (
                        <span key={tag}>{tag}</span>
                    ))}
                </div>

            </section>


            {/* Reviews */}
            <section className="product-reviews">

                <div className="reviews-header">
                    <h2>Customer reviews</h2>

                    <div className="reviews-average">
                        <strong>{product.rating}</strong>
                        <span>★</span>
                        <small>{product.reviews.length} reviews</small>
                    </div>
                </div>

                <div className="reviews-list">

                    {product.reviews.map((review, index) => (
                        <article className="review" key={index}>

                            <div className="review-header">
                                <div>
                                    <strong>{review.reviewerName}</strong>
                                    <span>{review.reviewerEmail}</span>
                                </div>

                                <div className="review-rating">
                                    {"★".repeat(review.rating)}
                                    {"☆".repeat(5 - review.rating)}
                                </div>
                            </div>

                            <p className="review-comment">
                                {review.comment}
                            </p>

                            <time>
                                {new Date(review.date).toLocaleDateString()}
                            </time>

                        </article>
                    ))}

                </div>

            </section>

        </div>
    );
}

