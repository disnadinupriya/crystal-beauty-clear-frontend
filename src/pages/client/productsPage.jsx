import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader.jsx"; // Assuming you have a Loader component
import React from "react";
import PrductCard from "../../components/products-card.jsx";





export default function ProductPage() {

    const [productList, setProductList] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [search, setSearch] = useState("");
    useEffect (
        ()=>{
           if(!productsLoaded){
              axios.get(import.meta.env.VITE_BACKEND_URL+ '/api/product/')
            .then((res)=>{
                console.log("Products fetched successfully:", res.data);
                // normalize response shape: server may return array or { products: [...] }
                const products = res.data?.products ?? res.data;
                setProductList(products || []);
                setProductsLoaded(true);
            })
            .catch((error)=>{
                console.error("Error fetching products:", error);
            })
        }
            
        },[productsLoaded]
    )
function searchproducts() {
    if (search.trim().length === 0) return;

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/product/search?q=${encodeURIComponent(search)}`;

    axios.get(url)
        .then((res) => {
            console.log("Search results:", res.data);
            setProductList(res.data || []);
            setProductsLoaded(true);
        })
        .catch((err) => {
            console.error('Search request failed:', err);
            setProductList([]);
            setProductsLoaded(true);
        });
}

    return (
        <div className="h-full w-full ">
            <div className="w-full flex justify-center my-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                    onClick={() => {
                        searchproducts();
                        
                        
                    }}
                >
                    Search
                </button>
                <button
                    className="bg-green-500 text-white px-4 py-2 ml-2 rounded"
                    onClick={() => {
                        setSearch("");
                        setProductList([]);
                        setProductsLoaded(false);
                    }}
                >
                    Clear
                </button>
            </div>
            {
                productsLoaded ?
                <div className="w-full h-full flex flex-wrap justify-center">
                    {
                        Array.isArray(productList) && productList.map((product,index) => {
                            return(
                                <PrductCard key={product.productid ?? index} product={product} />
                            )
                        })
                    }
                   
                </div>
                 :
                    <Loader/>
            }
            
        </div>
    );
}
