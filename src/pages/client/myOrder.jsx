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
    const [sessionExpired, setSessionExpired] = useState(false); // New state for 401
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showQuickView, setShowQuickView] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            setSessionExpired(false);
            
            // ✅ Render Backend URL
            const backend = "https://crystal-beauty-clear-backend-rc8u.onrender.com"; 
            
            const token = localStorage.getItem("token");
            
            // Token එක නැත්නම් Login වෙන්න කියන්න
            if (!token) {
                setSessionExpired(true);
                setLoading(false);
                return;
            }

            const res = await axios.get(`${backend}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(Array.isArray(res.data) ? res.data : []);
            
        } catch (err) {
            console.error("Error fetching orders:", err);
            
            // ✅ මෙන්න විසඳුම: 401 Error එකක් ආවොත් පරණ Token එක මකනවා
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token"); // පරණ Token එක අයින් කරනවා
                localStorage.removeItem("user");
                setSessionExpired(true); // Login Screen එක පෙන්නනවා
            } else {
                // වෙනත් Error එකක් නම් (Network අවුලක් වගේ)
                setError("Connection issue. Using Demo Data for now.");
                // Demo Data පෙන්වන්න (User Experience එක කැඩෙන්නේ නැති වෙන්න)
                setOrders([
                    { _id: "DEMO-1", createdAt: new Date().toISOString(), total: 4500.00, status: "Processing (Demo)", products: [] }
                ]);
            }
        } finally {
            setLoading(false);
        }
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

    // ✅ Session Expired / Not Logged In Screen
    if (sessionExpired)
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50/30 px-4 text-center">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full border border-emerald-100">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Your session has expired or is invalid. Please login again to verify your identity.
                    </p>
                    <button 
                        onClick={() => window.location.href = "/login"} 
                        className="block w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                        Login Now
                    </button>
                </div>
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
                    {error && <p className="text-amber-600 text-xs mt-2 font-bold">{error}</p>}
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm border border-emerald-50 text-center">
                        <div className="bg-emerald-50 p-6 rounded-full mb-4"><IconBox /></div>
                        <h3 className="text-xl font-serif text-emerald-900 font-bold">No orders found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs">Start shopping to see your orders here.</p>
                        <Link to="/products" className="mt-4 text-emerald-600 font-bold hover:underline">Shop Now</Link>
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

                {/* Quick View Modal (Mobile Fixed) */}
                {showQuickView && selectedOrder && (
                    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={closeQuickView}>
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