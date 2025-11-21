import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// --- INTERNAL MOCK ICONS ---
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

// --- MOCK LOADER COMPONENT ---
const Loader = () => (
  <div className="flex flex-col justify-center items-center h-64 w-full gap-4">
    <div className="relative flex justify-center items-center">
      <div className="absolute h-16 w-16 border-4 border-emerald-100 rounded-full"></div>
      <div className="absolute h-16 w-16 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
      <div className="animate-pulse scale-75"><LeafIcon /></div>
    </div>
    <p className="text-emerald-800 font-serif font-medium tracking-widest text-sm animate-pulse uppercase">Loading...</p>
  </div>
);

// --- MOCK IMAGE SLIDER ---
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fallback image if none provided
  const safeImages = images && images.length > 0 
    ? images 
    : ["https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop"];

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-xl group">
      <img 
        src={safeImages[currentIndex]} 
        alt="Product" 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      
      {/* Simple dots for navigation if multiple images */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {safeImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-emerald-600 w-4' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- MOCK CART UTILS ---
const addToCart = (product, qty) => {
  console.log("Added to cart:", product.name, "Qty:", qty);
  // In real app, this saves to localStorage or Context
};

export default function ProductOverView() {
  const { productid } = useParams();
  const navigate = useNavigate();

  // Fallback for preview if no ID is present in URL
  const currentId = productid || "1";

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  // Backend URL fix for preview environment
  const BACKEND_URL = "http://localhost:5000";

  // Mock Product Data for Preview (Fallback)
  const mockProductData = {
    productid: currentId,
    name: "Aloe Vera Soothing Gel",
    altName: ["Pure Aloe", "Hydrating Gel"],
    price: 1250.00,
    lablePrice: 1500.00,
    description: "Experience the purity of nature with our 100% organic Aloe Vera gel. Perfect for soothing sunburns, hydrating dry skin, and giving your face a radiant, natural glow. Sourced directly from our medicinal gardens.",
    Image: ["https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop"],
    stock: 20
  };

  useEffect(() => {
    if (status === "loading") {
      // Try fetching from API, fallback to mock data if it fails (expected in preview)
      axios
        .get(BACKEND_URL + "/api/product/" + currentId)
        .then((res) => {
          setProduct(res.data);
          setStatus("loaded");
        })
        .catch((error) => {
          console.warn("Using mock data because API failed:", error);
          // Fallback logic for preview
          setProduct(mockProductData);
          setStatus("loaded");
        });
    }
  }, [status, currentId]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/30">
      <Loader />
    </div>
  );

  if (status === "error") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-emerald-50/30">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-400 mb-2">Product not found</h1>
          <button onClick={() => navigate('/products')} className="text-emerald-600 hover:underline">Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-emerald-50/30 font-sans py-12 px-4 sm:px-6 lg:px-8">
      
      {/* --- Main Container --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 overflow-hidden border border-emerald-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* --- Left: Image Section (Premium Look) --- */}
          <div className="w-full bg-gray-50/50 p-8 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-emerald-100/50">
            <div className="w-full max-w-lg bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <ImageSlider images={product.Image} />
            </div>
          </div>

          {/* --- Right: Details Section --- */}
          <div className="w-full p-8 md:p-16 flex flex-col justify-center">
            
            {/* Breadcrumb / Tag */}
            <span className="inline-block text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Natural Collection
            </span>

            {/* Product Name */}
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-2">
              {product.name}
            </h1>

            {/* Alt Name / Subtitle */}
            {product.altName?.length > 0 && (
              <h2 className="text-lg text-gray-500 font-medium italic mb-6">
                {product.altName.join(", ")}
              </h2>
            )}

            {/* Price Block */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              {product.lablePrice > product.price ? (
                <>
                  <span className="text-4xl font-bold text-emerald-700">
                    LKR {product.price.toFixed(2)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg text-gray-400 line-through decoration-red-400/50">
                      LKR {product.lablePrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      Save LKR {(product.lablePrice - product.price).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  LKR {product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Description</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                className="flex-1 bg-white border-2 border-emerald-600 text-emerald-700 font-bold py-4 px-8 rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                onClick={() => {
                  addToCart(product, 1);
                  toast.success("Product added to cart");
                }}
              >
                Add to Cart
              </button>

              <button
                className="flex-1 bg-emerald-600 border-2 border-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-700 hover:border-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-200 active:scale-[0.98]"
                onClick={() => {
                  navigate("/checkout", {
                    state: {
                      item: [
                        {
                          productid: product.productid,
                          name: product.name,
                          altName: product.altName,
                          price: product.price,
                          lablePrice: product.lablePrice,
                          Image: product.Image,
                          stock: product.stock,
                          quantity: 1,
                        },
                      ],
                    },
                  });
                }}
              >
                Buy Now
              </button>
            </div>
            
            {/* Trust Badges (Visual enhancement) */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex gap-6 text-gray-400 text-sm">
               <span className="flex items-center gap-1"><span className="text-emerald-500">✔</span> 100% Authentic</span>
               <span className="flex items-center gap-1"><span className="text-emerald-500">✔</span> Quality Checked</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}