import "./ProductList.css"
import ProductCard from "./ProductCard.jsx";
import Product from "./Product.jsx";
import { useEffect, useRef, useState} from "react";
import PriceCalculatorUI from "../PriceCalculator/PriceCalculatorUI.jsx";

export default function LoadProductList() {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef(null);

    const [includeVAT, setIncludeVAT] = useState(true);


    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const response = await fetch(`http://localhost:5050/products?_page=${page}&_per_page=10`)
            const data = await response.json()

            const newProducts = data.data.map(
                product => new Product(product.id, product.title, product.price, product.images)
            );

            setProducts(prev => [...prev, ...newProducts]);
            setHasMore(newProducts.length === 10);
            setLoading(false);
        }
        fetchProducts();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 1 }
        );

        if(sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading]);

    return(
        <div className="product-list-wrapper">

            <PriceCalculatorUI
                calc={null}
                includeVAT={includeVAT}
                setIncludeVAT={setIncludeVAT}
            />
            
            <div className="product-list">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

        <div ref={sentinelRef} style={{ height: "10px" }} />
        {loading && <p style={{ textAlign: "center"}}>Loading more products...</p>}
        {!hasMore && <p style={{ textAlign: "center"}}>No more products found.</p>}

        </div>
    )
}

