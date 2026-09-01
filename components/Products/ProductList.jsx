import "./ProductList.css"
import ProductCard from "./ProductCard.jsx";
import {useEffect, useState} from "react";
import Product from "./Product.jsx";

export default function LoadProductList() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const page = Math.floor(Math.random() * 5) + 1;
        async function fetchProducts() {
            const response = await fetch(`http://localhost:5050/products?_page=${page}&_per_page=40`)
            const data = await response.json()

            const products = data.data.map(
                product => new Product(
                    product.id,
                    product.title,
                    product.price,
                    product.images
                )
            );

            setProducts(products);
        }
        fetchProducts();
    }, []);

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
        </div>
    )
}

