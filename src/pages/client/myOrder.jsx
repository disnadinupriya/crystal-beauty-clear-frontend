import React, { useState, useEffect } from "react";
import axios from "axios";

// --- INTERNAL ICONS FOR STYLING ---
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Changed for Preview stability (You can revert to import.meta.env.VITE_BACKEND_URL)
            const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            
            // Note: In this preview, token might be missing, so it might show error or empty.
            if (!token) {
                // For PREVIEW ONLY: If no token, we set mock data to show the design. 
                // Remove this else block in production.
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
                return;
            }

            const res = await axios.get(`${VITE_BACKEND_URL}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            const msg = err.response?.data?.message || err.message || "Failed to fetch orders";
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
        const maybeImage =
            first?.image ||
            first?.images?.[0] ||
            first?.product?.image ||
            first?.product?.images?.[0] ||
            first?.product?.thumbnail ||
            first?.thumbnail ||
            null;

        return maybeImage || null;
    };

    if (loading)
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                <p className="mt-4 text-emerald-800 font-serif tracking-widest text-sm uppercase">Loading orders...</p>
            </div>
        );

    if (error && orders.length === 0)
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center bg-emerald-50/30 text-center px-4">
                <p className="text-red-500 font-medium bg-red-50 px-6 py-3 rounded-full border border-red-100">{error}</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-emerald-50/30 font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Header --- */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-emerald-950">My Orders</h1>
                    <p className="text-emerald-600/70 mt-2 font-medium tracking-wide uppercase text-sm">
                        History & Status • <span className="text-emerald-800">{orders.length} orders placed</span>
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm border border-emerald-50 text-center">
                        <div className="bg-emerald-50 p-6 rounded-full mb-4">
                            <IconBox />
                        </div>
                        <h3 className="text-xl font-serif text-emerald-900 font-bold">No orders found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs">Looks like you haven't discovered our natural treasures yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {orders.map((order, idx) => {
                            const orderKey = order._id ?? order.orderId ?? order.id ?? idx;
                            const orderLabel = order.orderId ?? order._id ?? order.id ?? "-";
                            const dateVal = order.createdAt ?? order.date ?? order.purchasedAt ?? null;
                            const totalVal = Number(order.total ?? order.amount ?? 0) || 0;
                            const rawStatus = (order.status ?? order.orderStatus ?? "").toString();
                            const statusLabel = rawStatus
                                ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
                                : "Unknown";

                            const productsArr = Array.isArray(order.products) ? order.products : Array.isArray(order.items) ? order.items : [];
                            const productCount = productsArr.length;
                            const firstImage = getFirstProductImage(order);

                            return (
                                <div
                                    key={orderKey}
                                    className="group bg-white rounded-[2rem] shadow-sm border border-emerald-100/50 p-6 hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                >
                                    {/* Top: Image & ID */}
                                    <div className="relative h-48 bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100">
                                        {firstImage ? (
                                            <img
                                                src={firstImage}
                                                alt={`order-${orderLabel}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-emerald-200">
                                                <IconBox />
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white">
                                            <p className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                                #{orderLabel.toString().slice(-6)}
                                            </p>
                                        </div>

                                        {productCount > 1 && (
                                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                +{productCount - 1} Items
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Ordered On</p>
                                            <p className="text-emerald-950 font-medium">
                                                {dateVal ? new Date(dateVal).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total</p>
                                            <p className="text-lg font-serif font-bold text-emerald-700">
                                                LKR {totalVal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                            statusLabel === "Pending" || statusLabel === "Processing"
                                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                                : statusLabel === "Shipped"
                                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                                : statusLabel === "Delivered"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-gray-50 text-gray-600 border-gray-100"
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${
                                                statusLabel === "Pending" || statusLabel === "Processing" ? "bg-amber-500" :
                                                statusLabel === "Shipped" ? "bg-blue-500" :
                                                statusLabel === "Delivered" ? "bg-emerald-500" : "bg-gray-400"
                                            }`}></span>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                                        <button
                                            className="flex-1 py-3 rounded-xl bg-gray-50 text-gray-600 text-sm font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                            onClick={() => handleQuickView(order)}
                                        >
                                            Quick View
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- Quick View Modal (Glassmorphism) --- */}
                {showQuickView && selectedOrder && (
                    <div
                        className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={closeQuickView}
                    >
                        <div
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-fade-in-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-emerald-900 p-6 flex justify-between items-center">
                                <h2 className="text-white font-serif font-bold text-xl">
                                    Order #{selectedOrder.orderId ?? selectedOrder._id ?? selectedOrder.id ?? "-"}
                                </h2>
                                <button
                                    className="text-emerald-200 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
                                    onClick={closeQuickView}
                                >
                                    <IconClose />
                                </button>
                            </div>

                            <div className="p-8">
                                {(() => {
                                    const firstImage = getFirstProductImage(selectedOrder);
                                    const productsArr = Array.isArray(selectedOrder.products) ? selectedOrder.products : Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
                                    const productNames = productsArr.map(p => p.name ?? p.product?.name ?? p.title ?? p.product?.title).filter(Boolean);
                                    const selTotal = Number(selectedOrder.total ?? selectedOrder.amount ?? 0) || 0;
                                    const selDate = selectedOrder.createdAt ?? selectedOrder.date ?? null;

                                    return (
                                        <>
                                            {firstImage && (
                                                <div className="mb-6 w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                                                    <img src={firstImage} alt="Product Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                                    <span className="text-gray-500 text-sm">Date</span>
                                                    <span className="font-medium text-gray-800">
                                                        {selDate ? new Date(selDate).toLocaleDateString() : "-"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                                    <span className="text-gray-500 text-sm">Status</span>
                                                    <span className="font-bold text-emerald-600">
                                                        {selectedOrder.status ?? "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                                    <span className="text-gray-500 text-sm">Total Amount</span>
                                                    <span className="font-serif font-bold text-xl text-emerald-700">
                                                        LKR {selTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-gray-500 text-sm block mb-2">Items ({productNames.length})</span>
                                                    <ul className="text-sm text-gray-800 font-medium space-y-1 bg-gray-50 p-4 rounded-xl">
                                                        {productNames.length > 0 ? (
                                                            productNames.slice(0, 3).map((name, i) => (
                                                                <li key={i} className="truncate">• {name}</li>
                                                            ))
                                                        ) : (
                                                            <li className="text-gray-400 italic">No details available</li>
                                                        )}
                                                        {productNames.length > 3 && <li className="text-xs text-gray-400 italic">+ {productNames.length - 3} more...</li>}
                                                    </ul>
                                                </div>
                                            </div>

                                            <button 
                                                className="w-full mt-8 bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                                onClick={closeQuickView}
                                            >
                                                View Full Details
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

export default MyOrder;