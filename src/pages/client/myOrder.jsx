import React, { useState, useEffect } from "react";
import axios from "axios";

// ==========================================
// ✅ FIXED: Using your Live Render Backend URL
// ==========================================
const BACKEND_URL = "https://crystal-beauty-clear-backend-rc8u.onrender.com";
// ==========================================

const IconBox = () => (
  <svg className="w-10 h-10 md:w-12 md:h-12 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
);
const IconClose = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);
const IconRefresh = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
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
            
            const token = localStorage.getItem("token");

            // If no token, show demo data (Remove this block if you want strict security)
            if (!token) {
                console.warn("No token found");
                // Optional: You can redirect to login here
                setLoading(false);
                return; 
            }

            // Using the Render URL explicitly
            const res = await axios.get(`${BACKEND_URL}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch Error:", err);
            let msg = "Failed to load orders.";
            
            if (err.message === "Network Error") {
                 msg = "Connection failed. Please check your internet.";
            } else if (err.response) {
                msg = err.response.data.message || "Server Error";
            }
            
            setError(msg);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickView = (order) => {
        setSelectedOrder(order);
        setShowQuickView(true);
    };

    const closeQuickView = () => {
        setShowQuickView(false);
        setSelectedOrder(null);
    };

    const getFirstProductImage = (order) => {
        const products = order?.products ?? order?.items ?? [];
        if (!Array.isArray(products) || products.length === 0) return null;
        const first = products[0];
        // Checks various image paths depending on how your DB saves it
        return first?.image || 
               first?.product?.image || 
               first?.images?.[0] ||
               first?.product?.images?.[0] ||
               null;
    };

    if (loading)
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                <p className="mt-4 text-emerald-800 font-serif text-xs uppercase animate-pulse">Loading Orders...</p>
            </div>
        );

    // --- ERROR UI ---
    if (error && orders.length === 0)
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6">
                <div className="bg-white p-8 rounded-3xl shadow-lg max-w-sm w-full border border-red-100 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Oops!</h3>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <button 
                        onClick={fetchOrders} 
                        className="w-full flex items-center justify-center py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all font-bold shadow-md shadow-emerald-200"
                    >
                        <IconRefresh /> Try Again
                    </button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-emerald-50/30 font-sans py-8 md:py-12 px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-emerald-950">My Orders</h1>
                    <p className="text-emerald-600/70 mt-1 md:mt-2 font-medium tracking-wide uppercase text-xs md:text-sm">
                        History & Status • <span className="text-emerald-800 font-bold">{orders.length} orders</span>
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2rem] shadow-sm border border-emerald-50 text-center mx-2 md:mx-0">
                        <div className="bg-emerald-50 p-6 rounded-full mb-4"><IconBox /></div>
                        <h3 className="text-lg font-serif text-emerald-900 font-bold">No orders found</h3>
                        <p className="text-gray-400 text-sm mt-2">Start shopping to see your orders here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                        {orders.map((order, idx) => {
                            const totalVal = Number(order.total || 0);
                            const firstImage = getFirstProductImage(order);
                            
                            return (
                                <div key={idx} className="bg-white rounded-3xl shadow-sm border border-emerald-100/50 p-5 flex flex-col hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative h-40 bg-gray-50 rounded-2xl overflow-hidden mb-5">
                                        {firstImage ? (
                                            <img src={firstImage} alt="Order" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-emerald-100"><IconBox /></div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-[10px] font-bold text-emerald-800 border border-emerald-100">
                                            #{order._id?.slice(-6) || "ID"}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                                            <p className="text-sm font-medium text-emerald-950">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                                            <p className="text-lg font-serif font-bold text-emerald-700">LKR {totalVal.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Status Bar */}
                                    <div className="mb-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {order.status || 'Processing'}
                                        </span>
                                    </div>

                                    <button 
                                        onClick={() => handleQuickView(order)} 
                                        className="w-full mt-auto py-3 bg-gray-50 text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                    >
                                        View Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MODAL */}
                {showQuickView && selectedOrder && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={closeQuickView}>
                        <div className="bg-white rounded-t-[2rem] md:rounded-[2rem] w-full max-w-md p-6 animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
                                <h3 className="font-serif font-bold text-xl text-emerald-900">Order Details</h3>
                                <button onClick={closeQuickView} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><IconClose /></button>
                            </div>
                            
                            <div className="space-y-5">
                                {/* Image in Modal */}
                                {getFirstProductImage(selectedOrder) && (
                                    <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden">
                                        <img src={getFirstProductImage(selectedOrder)} className="w-full h-full object-cover" alt="Product" />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">Order ID</span>
                                        <span className="font-bold text-gray-900">#{selectedOrder._id}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">Status</span>
                                        <span className="font-bold text-emerald-600 uppercase">{selectedOrder.status || "Processing"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">Total Amount</span>
                                        <span className="font-serif font-bold text-xl text-emerald-700">LKR {Number(selectedOrder.total).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Items</p>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                        {(selectedOrder.products || selectedOrder.items || []).map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-gray-800 font-medium truncate w-2/3">
                                                    {item.product?.name || item.name || "Product"}
                                                </span>
                                                <span className="text-gray-500">x{item.quantity || 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={closeQuickView} className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl mt-2 active:scale-95 transition-transform shadow-lg shadow-emerald-200">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrder;