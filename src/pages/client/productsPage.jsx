import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader.jsx"; 
import React from "react";
import PrductCard from "../../components/products-card.jsx";

// --- INTERNAL ICONS FOR STYLING (Styling walata witharak use karana icons) ---
const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);
const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

export default function ProductPage() {

    const [productList, setProductList] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [search, setSearch] = useState("");

    // --- 1. INITIAL DATA FETCH ---
    useEffect(() => {
        if (!productsLoaded) {
            axios.get(import.meta.env.VITE_BACKEND_URL + '/api/product/')
                .then((res) => {
                    console.log("Products fetched successfully:", res.data);
                    const products = res.data?.products ?? res.data;
                    setProductList(products || []);
                    setProductsLoaded(true);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                })
        }
    }, [productsLoaded])

    // --- 2. AUTO SEARCH EFFECT (Aluthin ekathu kala) ---
    // Type karana hama welawema meka wada karanawa
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.trim().length > 0) {
                searchproducts(); // Akurak gahuwama auto search wenawa
            } else if (productsLoaded && search === "") {
                // Search eka makapu gaman mula idan products pennanawa
                setProductsLoaded(false); 
            }
        }, 300); // Milliseconds 300k parakku wela search wei (Performance hodai)

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

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
        // --- BACKGROUND CHANGE: bg-emerald-50/30 (Laa kola pata) ---
        <div className="min-h-screen bg-emerald-50/30 font-sans pb-12">
            
            {/* --- Page Title Section (Premium Design) --- */}
            <div className="bg-[#022c22] text-white py-8 px-4 mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">Our Collection</h1>
                    <p className="text-emerald-200/80 text-sm mt-2">Pure. Natural. Effective.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- Search Bar Design (Updated) --- */}
                <div className="w-full flex justify-center mb-10">
                    <div className="bg-white p-2 rounded-full shadow-lg flex items-center w-full max-w-2xl border border-emerald-100 focus-within:border-emerald-300 transition-all">
                        <div className="pl-4 text-gray-400">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            className="flex-grow px-4 py-2 text-gray-700 outline-none placeholder-gray-400 bg-transparent"
                            placeholder="Search products (e.g. Aloe Vera)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex gap-2 pr-1">
                            <button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-sm flex items-center gap-2"
                                onClick={() => searchproducts()}
                            >
                                Search
                            </button>
                            {search && (
                                <button
                                    className="bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 px-4 py-2 rounded-full font-medium transition-all border border-gray-200"
                                    onClick={() => {
                                        setSearch("");
                                        setProductsLoaded(false);
                                    }}
                                    title="Clear Search"
                                >
                                    <IconX />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Product Grid --- */}
                {
                    productsLoaded ?
                        <div className="w-full h-full flex flex-wrap justify-center gap-6">
                            {
                                Array.isArray(productList) && productList.length > 0 ? (
                                    productList.map((product, index) => {
                                        return (
                                            <div key={product.productid ?? index} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[calc(25%-1.5rem)] flex justify-center">
                                                <PrductCard product={product} />
                                            </div>
                                        )
                                    })
                                ) : (
                                    // No Products Found State
                                    <div className="text-center py-20">
                                        <div className="inline-block p-4 rounded-full bg-emerald-50 text-emerald-300 mb-3">
                                            <IconSearch />
                                        </div>
                                        <h3 className="text-xl text-gray-600 font-serif">No products found</h3>
                                        <p className="text-gray-400 text-sm">Try adjusting your search terms.</p>
                                    </div>
                                )
                            }

                        </div>
                        :
                        <div className="min-h-[400px] flex items-center justify-center">
                            <Loader />
                        </div>
                }

            </div>
        </div>
    );
}