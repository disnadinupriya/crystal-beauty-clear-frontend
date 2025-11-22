import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

// --- INTERNAL ICONS ---
const IconBox = () => (
  <svg className="w-12 h-12 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
);
const IconClose = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showQuickView, setShowQuickView] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // ✅ 1. Render Backend URL (Mobile සහ Desktop දෙකටම)
            const backend = "https://crystal-beauty-clear-backend-rc8u.onrender.com"; 
            
            const token = localStorage.getItem("token");
            
            // ✅ 2. Token එක නැත්නම් හෝ Login වෙලා නැත්නම් DEMO DATA පෙන්වන්න (Error පෙන්වන්න එපා)
            if (!token) {
                console.log("No token found. Showing Demo Data.");
                showDemoData(); 
                setLoading(false);
                return;
            }

            // Server එකෙන් Orders ඉල්ලීම
            const res = await axios.get(`${backend}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(Array.isArray(res.data) ? res.data : []);
            
        } catch (err) {
            console.error("Error fetching orders:", err);
            
            // ✅ 3. Login Error (401) ආවත් Demo Data පෙන්වන්න (User ට අවුලක් පේන්නේ නෑ)
            // නමුත් නියම Data බලන්න නම් User අනිවාර්යයෙන් Logout වී Login විය යුතුයි.
            if (err.response && err.response.status === 401) {
               console.log("Token expired or invalid. Showing Demo Data.");
               showDemoData();
               setError("Viewing as Guest (Please Login to see Real Orders)");
            } else {
                // Network Error නම් Demo Data පෙන්වා Error එක යටින් දාන්න
                showDemoData();
                setError("Connection Failed. Showing Offline Data.");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- DEMO DATA FUNCTION (User ට Page එක හිස්ව පෙනීම වලක්වයි) ---
    const showDemoData = () => {
        setOrders([
            {
                _id: "DEMO-7829-XJ",
                createdAt: new Date().toISOString(),
                total: 4500.50,
                status: "Processing",
                products: [{ product: { name: "Aloe Vera Gel (Demo)", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop" } }]
            },
            {
                _id: "DEMO-1120-PL",
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                total: 12500.00,
                status: "Delivered",
                products: [
                    { product: { name: "Sandalwood Scrub (Demo)", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2670&auto=format&fit=crop" } },
                    { product: { name: "Face Cream" } }
                ]
            }
        ]);
    };

    const handleQuickView = (order) => { setSelectedOrder(order); setShowQuickView(true); };
    const closeQuickView = () => { setShowQuickView(false); setSelectedOrder(null); };

    const getFirstProductImage = (order) => {
        const products = order?.products ?? order?.items ?? [];
        if (!Array.isArray(products) || products.length === 0) return null;
        const first = products[0];
        return first?.image || first?.images?.[0] || first?.product?.image || null;
    };

    if (loading)
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                <p className="mt-4 text-emerald-800 font-serif tracking-widest text-sm uppercase">Loading orders...</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-emerald-50/30 font-sans py-12 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-emerald-950">My Orders</h1>
                    <p className="text-emerald-600/70 mt-2 font-medium tracking-wide uppercase text-sm">
                        History & Status • <span className="text-emerald-800">{orders.length} orders placed</span>
                    </p>
                    {/* Error Message එකක් තිබේ නම් මෙතන පෙන්වයි */}
                    {error && (
                        <div className="mt-4 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm inline-block border border-amber-200">
                             ⚠️ {error} <Link to="/login" className="underline font-bold ml-2">Login Again</Link>
                        </div>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm border border-emerald-50 text-center">
                        <div className="bg-emerald-50 p-6 rounded-full mb-4"><IconBox /></div>
                        <h3 className="text-xl font-serif text-emerald-900 font-bold">No orders found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs">Start shopping to see your orders here.</p>
                        <Link to="/products" className="mt-4 text-emerald-600 font-bold hover:underline">Go to Shop</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {orders.map((order, idx) => {
                            const totalVal = Number(order.total || 0);
                            const statusLabel = order.status || "Processing";
                            const firstImage = getFirstProductImage(order);

                            return (
                                <div key={idx} className="group bg-white rounded-[2rem] shadow-sm border border-emerald-100/50 p-6 hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                    <div className="relative h-48 bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100">
                                        {firstImage ? (
                                            <img src={firstImage} alt="Order" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-emerald-200"><IconBox /></div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white">
                                            <p className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">#{order._id?.slice(-6)}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Date</p>
                                            <p className="text-emerald-950 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total</p>
                                            <p className="text-lg font-serif font-bold text-emerald-700">LKR {totalVal.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                            statusLabel === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <button onClick={() => handleQuickView(order)} className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all">
                                        View Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- Quick View Modal (FIXED FOR MOBILE SCROLLING) --- */}
                {showQuickView && selectedOrder && (
                    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={closeQuickView}>
                        {/* ✅ FIX: max-h-[90vh] added for scrolling */}
                        <div className="bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-emerald-900 p-6 flex justify-between items-center flex-shrink-0">
                                <h2 className="text-white font-serif font-bold text-xl">Order Details</h2>
                                <button className="text-emerald-200 hover:text-white bg-white/10 p-2 rounded-full" onClick={closeQuickView}><IconClose /></button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                {getFirstProductImage(selectedOrder) && (
                                    <div className="mb-6 w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner flex-shrink-0">
                                        <img src={getFirstProductImage(selectedOrder)} alt="Product" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-50 pb-3">
                                        <span className="text-gray-500 text-sm">Order ID</span>
                                        <span className="font-medium text-gray-800">#{selectedOrder._id}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-3">
                                        <span className="text-gray-500 text-sm">Total</span>
                                        <span className="font-serif font-bold text-xl text-emerald-700">LKR {Number(selectedOrder.total).toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm block mb-2">Items</span>
                                        <ul className="text-sm text-gray-800 font-medium space-y-1 bg-gray-50 p-4 rounded-xl">
                                            {(selectedOrder.products || []).map((p, i) => (
                                                <li key={i} className="truncate">• {p.product?.name || "Product"} (x{p.quantity || 1})</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <button onClick={closeQuickView} className="w-full mt-8 bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrder;