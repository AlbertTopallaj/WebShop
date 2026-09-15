import "./ProductList.css"
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import Product from "../../components/ProductCard/Product.js";
import {useEffect, useRef, useState} from "react";
import {getModules} from "../../scripts/ModuleRegistry.js";
import Campaign from "../../src/modules/campaign/index.js";

export default function LoadProductList() {
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState("")
    const [dailyDiscount, setDailyDiscount] = useState(undefined)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef(null);

    const campaignInstance = getModules().find(module => module === Campaign)?.instance


    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
<<<<<<< HEAD
            const response = await fetch(`http://localhost:5050/products?_page=${page}&_per_page=10`)
            const data = await response.json()
            console.log("API PRODUCT:", data.data[0]);
            console.log("WEIGHT:", data.data[0]?.weight);
            console.log("DIMENSIONS:", data.data[0]?.dimensions);

            const newProducts = data.data.map(
                product => new Product(product.id, product.title, product.price, product.images, product.stock, product.weight, product.dimensions)
=======
            const fetchUrl = category ?
                `http://localhost:5050/products?category=${category}&_page=${page}&_per_page=10` :
                `http://localhost:5050/products?_page=${page}&_per_page=10`
            const response = await fetch(fetchUrl)
            let data = await response.json()
            if (campaignInstance) {
                try {
                    const {context, message} = await campaignInstance.run(data.data)
                    if (context) data.data = context
                    if (message) setDailyDiscount(message)
                } catch (_) {
                    // If campaign cannot be applied properly, skip
                }
            }
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
>>>>>>> a9c526b707da1c71044a3f4f706265a5e38e0370
            );
            console.log("MAPPED PRODUCT:", newProducts[0]);
            console.log("MAPPED WEIGHT:", newProducts[0]?.weight);
            console.log("MAPPED DIMENSIONS:", newProducts[0]?.dimensions);

            setProducts(prev => [...prev, ...newProducts]);
            setHasMore(newProducts.length === 10);
            setLoading(false);
        }

        fetchProducts();
    }, [page, category]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            {threshold: 1}
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading]);

    return (
        <>
            <div className="category-selector">
                {dailyDiscount && (
                    <div className="daily-discount">
                        Daily discount on: {dailyDiscount}
                    </div>
                )}
                <select
                    value={category}
                    onChange={e => {
                        setCategory(e.target.value);
                        setProducts([]);
                        setPage(1);
                        setHasMore(true);
                    }}
                >
                    <option value="">All</option>

                    <optgroup label="Home">
                        <option value="groceries">Groceries</option>
                        <option value="home-decoration">Home Decoration</option>
                        <option value="furniture">Furniture</option>
                        <option value="kitchen-accessories">Kitchen Accessories</option>
                    </optgroup>

                    <optgroup label="Electronics">
                        <option value="laptops">Laptops</option>
                        <option value="smartphones">Smartphones</option>
                        <option value="tablets">Tablets</option>
                        <option value="mobile-accessories">Mobile Accessories</option>
                    </optgroup>

                    <optgroup label="Beauty">
                        <option value="beauty">Beauty</option>
                        <option value="skin-care">Skin Care</option>
                        <option value="fragrances">Fragrances</option>
                    </optgroup>

                    <optgroup label="Men">
                        <option value="mens-shirts">Men's Shirts</option>
                        <option value="mens-shoes">Men's Shoes</option>
                        <option value="mens-watches">Men's Watches</option>
                        <option value="sunglasses">Sunglasses</option>
                    </optgroup>

                    <optgroup label="Women">
                        <option value="womens-dresses">Women's Dresses</option>
                        <option value="tops">Tops</option>
                        <option value="womens-shoes">Women's Shoes</option>
                        <option value="womens-bags">Women's Bags</option>
                        <option value="womens-jewellery">Women's Jewellery</option>
                        <option value="womens-watches">Women's Watches</option>
                    </optgroup>

                    <optgroup label="Sports">
                        <option value="sports-accessories">Sports Accessories</option>
                    </optgroup>

                    <optgroup label="Vehicles">
                        <option value="vehicle">Vehicle</option>
                        <option value="motorcycle">Motorcycle</option>
                    </optgroup>
                </select>
            </div>

            <div className="product-list-wrapper">
                <div className="product-list">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                <div ref={sentinelRef} style={{height: "10px"}}/>
                {loading && <p style={{textAlign: "center"}}>Loading more products...</p>}
                {!hasMore && <p style={{textAlign: "center"}}>No more products found.</p>}
            </div>
        </>
    )
}

