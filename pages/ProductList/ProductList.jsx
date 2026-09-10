import "./ProductList.css"
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import Product from "../../components/ProductCard/Product.js";
import { useEffect, useRef, useState} from "react";
import {getInstances} from "../../scripts/ModuleRegistry.js";

export default function LoadProductList() {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef(null);

    const campaignInstance = getInstances().find(instance => instance.constructor.descriptor.name === "campaign")


    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const response = await fetch(`http://localhost:5050/products?_page=${page}&_per_page=10`)
            const data = await response.json()
            if (campaignInstance) await campaignInstance.run(data.data)
            const newProducts = data.data.map(
                product => new Product(
                    product.id,
                    product.title,
                    product.price,
                    product.images,
                    product.weight,
                    product.dimensions,
                    product.stock,
                    product.category,
                    product.discountPercentage
                )
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

