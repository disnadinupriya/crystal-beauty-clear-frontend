import React, { useState, useEffect } from "react";
import axios from "axios";

// --- CONFIGURATION ---
// ⚠️ වැදගත්: Phone එකෙන් බලනවා නම් 'localhost' වෙනුවට ඔබේ PC එකේ IP එක දාන්න.
// උදා: "http://192.168.1.10:5000"
const BACKEND_URL = "http://localhost:5000"; 

// --- INTERNAL ICONS ---
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token");
            
            // --- TESTING MODE (If no token is found, show Mock Data) ---
            if (!token) {
                // Remove this block in production if you want strictly secure access
                console.warn("No token found - Showing Demo Data");
                setTimeout(() => {
                    setOrders([
                        {
                            _id: "ORD-7829-XJ",
                            createdAt: new Date().toISOString(),
                            total: 4500.50,
                            status: "Processing",
                            products: [{ product: { name: "Aloe Vera Gel", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop" } }]
                        },
                        {
                            _id: "ORD-1120-PL",
                            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                            total: 12500.00,
                            status: "Delivered",
                            products: [
                                { product: { name: "Sandalwood Scrub", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2670&auto=format&fit=crop" } },
                                { product: { name: "Face Cream" } }
                            ]
                        }
                    ]);
                    setLoading(false);
                }, 1000);
                return;
            }

            const res = await axios.get(`${BACKEND_URL}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            const msg = err.response?.data?.message || err.message || "Failed to connect to server";
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
        return first?.image || 
               first?.images?.[0] || 
               first?.product?.image || 
               first?.product?.images?.[0] || 
               first?.product?.thumbnail || 
               null;
    };

    // --- LOADING STATE ---
    if (loading)
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                <p className="mt-4 text-emerald-800 font-serif tracking-widest text-xs md:text-sm uppercase animate-pulse">Syncing Orders...</p>
            </div>
        );

    // --- ERROR STATE (Improved UI) ---
    if (error && orders.length === 0)
        return (
            <div className="min-h-[80vh] flex flex-col justify-center items-center bg-emerald-50/30 text-center px-6">
                <div className="bg-white p-8 rounded-3xl shadow-lg max-w-sm w-full border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Connection Issue</h3>
                    <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-100 mb-6 break-words">
                        {error}
                    </p>
                    <button 
                        onClick={fetchOrders} 
                        className="w-full flex items-center justify-center py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95"
                    >
                        <IconRefresh /> Try Again
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                        Mobile users: Ensure you are using your PC's IP address, not localhost.
                    </p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-emerald-50/30 font-sans py-8 md:py-12 px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Header (Mobile Optimized) --- */}
                <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-emerald-950">My Orders</h1>
                    <p className="text-emerald-600/70 mt-1 md:mt-2 font-medium tracking-wide uppercase text-xs md:text-sm">
                        History & Status • <span className="text-emerald-800 font-bold">{orders.length} orders</span>
                    </p>
                </div>

                {orders.length === 0 ? (
                    // --- EMPTY STATE ---
                    <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-[2rem] shadow-sm border border-emerald-50 text-center mx-2 md:mx-0">
                        <div className="bg-emerald-50 p-6 rounded-full mb-4">
                            <IconBox />
                        </div>
                        <h3 className="text-lg md:text-xl font-serif text-emerald-900 font-bold">No orders found</h3>
                        <p className="text-gray-500 mt-2 text-sm md:text-base max-w-xs">Looks like you haven't discovered our natural treasures yet.</p>
                    </div>
                ) : (
                    // --- ORDER GRID ---
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                        {orders.map((order, idx) => {
                            const orderKey = order._id ?? idx;
                            const orderLabel = order.orderId ?? order._id ?? "-";
                            const dateVal = order.createdAt ?? order.date ?? null;
                            const totalVal = Number(order.total ?? order.amount ?? 0) || 0;
                            const rawStatus = (order.status ?? "").toString();
                            const statusLabel = rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : "Unknown";
                            
                            const productsArr = Array.isArray(order.products) ? order.products : [];
                            const productCount = productsArr.length;
                            const firstImage = getFirstProductImage(order);

                            return (
                                <div
                                    key={orderKey}
                                    className="group bg-white rounded-3xl shadow-sm border border-emerald-100/50 p-5 md:p-6 hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300 flex flex-col"
                                >
                                    {/* Image & ID */}
                                    <div className="relative h-40 md:h-48 bg-gray-50 rounded-2xl overflow-hidden mb-5 border border-gray-100">
                                        {firstImage ? (
                                            <img
                                                src={firstImage}
                                                alt="Order Preview"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-emerald-100">
                                                <IconBox />
                                            </div>
                                        )}
                                        
                                        {/* ID Badge */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white">
                                            <p className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                                #{orderLabel.toString().slice(-6)}
                                            </p>
                                        </div>

                                        {productCount > 1 && (
                                            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full">
                                                +{productCount - 1} Items
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Rows */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">Ordered On</p>
                                            <p className="text-emerald-950 font-medium text-sm md:text-base">
                                                {dateVal ? new Date(dateVal).toLocaleDateString() : "-"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">Total</p>
                                            <p className="text-base md:text-lg font-serif font-bold text-emerald-700">
                                                LKR {totalVal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide border ${
                                            statusLabel.includes("Pend") || statusLabel.includes("Proc") ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            statusLabel.includes("Ship") ? "bg-blue-50 text-blue-600 border-blue-100" :
                                            statusLabel.includes("Deliv") ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-gray-50 text-gray-600 border-gray-100"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                statusLabel.includes("Pend") || statusLabel.includes("Proc") ? "bg-amber-500" :
                                                statusLabel.includes("Ship") ? "bg-blue-500" :
                                                statusLabel.includes("Deliv") ? "bg-emerald-500" : "bg-gray-400"
                                            }`}></span>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    {/* Action Buttons (Mobile Friendly) */}
                                    <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                                        <button
                                            className="flex-1 py-2.5 md:py-3 rounded-xl bg-gray-50 text-gray-600 text-xs md:text-sm font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors active:bg-gray-200"
                                            onClick={() => handleQuickView(order)}
                                        >
                                            Quick View
                                        </button>
                                        <button className="flex-1 py-2.5 md:py-3 rounded-xl bg-emerald-600 text-white text-xs md:text-sm font-bold shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- Quick View Modal (Mobile Optimized) --- */}
                {showQuickView && selectedOrder && (
                    <div
                        className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
                        onClick={closeQuickView}
                    >
                        <div
                            className="bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-slide-up md:animate-fade-in-up max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-emerald-900 p-5 flex justify-between items-center z-10">
                                <h2 className="text-white font-serif font-bold text-lg">
                                    Order #{selectedOrder.orderId ?? selectedOrder._id?.slice(-6) ?? "-"}
                                </h2>
                                <button
                                    className="text-emerald-200 hover:text-white bg-white/10 p-2 rounded-full"
                                    onClick={closeQuickView}
                                >
                                    <IconClose />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {(() => {
                                    const firstImage = getFirstProductImage(selectedOrder);
                                    const productsArr = Array.isArray(selectedOrder.products) ? selectedOrder.products : [];
                                    const productNames = productsArr.map(p => p.name ?? p.product?.name).filter(Boolean);
                                    
                                    return (
                                        <>
                                            {firstImage && (
                                                <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                                                    <img src={firstImage} alt="Product" className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <InfoRow label="Date" value={selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : "-"} />
                                                <InfoRow label="Status" value={selectedOrder.status} valueClass="text-emerald-600 font-bold" />
                                                <InfoRow label="Total" value={`LKR ${Number(selectedOrder.total || 0).toFixed(2)}`} valueClass="text-emerald-700 font-serif font-bold text-lg" />
                                                
                                                <div className="pt-2">
                                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Items</span>
                                                    <div className="bg-gray-50 p-4 rounded-xl text-sm font-medium text-gray-700">
                                                        {productNames.length ? productNames.join(", ") : "No item details"}
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                                                onClick={closeQuickView}
                                            >
                                                Close
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Component for Modal Rows
const InfoRow = ({ label, value, valueClass = "text-gray-900 font-medium" }) => (
    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className={valueClass}>{value}</span>
    </div>
);

export default MyOrder;