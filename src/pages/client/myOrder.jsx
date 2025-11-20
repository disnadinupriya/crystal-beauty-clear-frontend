import React, { useState, useEffect } from "react";
import axios from "axios";

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
            const backend = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to view your orders");
                setOrders([]);
                setLoading(false);
                return;
            }

            const res = await axios.get(`${backend}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // backend returns an array of orders
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

    // Helper to safely get first product image from various possible shapes
    const getFirstProductImage = (order) => {
        // common shapes: order.products = [{ product: { images: [...] } }] or order.items = [{ image }] or order.products = [{ images: [...] }]
        const products = order?.products ?? order?.items ?? [];
        if (!Array.isArray(products) || products.length === 0) return null;

        const first = products[0];

        // try multiple common paths
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
        return <div className="text-center py-10 text-gray-600">Loading orders...</div>;

    if (error)
        return <div className="text-center py-10 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                <p className="text-gray-500 mt-1">{orders.length} orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 text-lg text-gray-500">No orders found</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order, idx) => {
                        const orderKey = order._id ?? order.orderId ?? order.id ?? idx;
                        const orderLabel = order.orderId ?? order._id ?? order.id ?? "-";
                        const dateVal = order.createdAt ?? order.date ?? order.purchasedAt ?? null;
                        const totalVal = Number(order.total ?? order.amount ?? 0) || 0;
                        const rawStatus = (order.status ?? order.orderStatus ?? "").toString();
                        const statusLabel = rawStatus
                            ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
                            : "Unknown";

                        // product count and image
                        const productsArr = Array.isArray(order.products)
                            ? order.products
                            : Array.isArray(order.items)
                            ? order.items
                            : [];
                        const productCount = productsArr.length;
                        const firstImage = getFirstProductImage(order);

                        return (
                            <div
                                key={orderKey}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition"
                            >
                                <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center relative overflow-hidden">
                                    {firstImage ? (
                                        <img
                                            src={firstImage}
                                            alt={`order-${orderLabel}-product`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m0 0h8"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    <span className="absolute top-2 left-2 bg-white shadow px-3 py-1 rounded-lg text-sm text-gray-500">
                                        #{orderKey}
                                    </span>

                                    {productCount > 1 && (
                                        <span className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                            +{productCount - 1} more
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Order #{orderLabel}</h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {dateVal ? new Date(dateVal).toLocaleDateString() : "-"}
                                    </p>
                                    <p className="text-gray-800 font-medium mt-1">${totalVal.toFixed(2)}</p>

                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                            statusLabel === "Pending"
                                                ? "bg-yellow-500"
                                                : statusLabel === "Shipped"
                                                ? "bg-blue-500"
                                                : statusLabel === "Delivered"
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-sm font-medium hover:bg-gray-200"
                                        onClick={() => handleQuickView(order)}
                                    >
                                        Quick View
                                    </button>

                                    <button className="px-4 py-2 bg-pink-600 text-white rounded-xl text-sm font-medium hover:bg-pink-700">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            
            {showQuickView && selectedOrder && (
    <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={closeQuickView}
    >
        <div
            className="bg-white rounded-xl shadow-xl p-8 w-11/12 max-w-md relative"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-black"
                onClick={closeQuickView}
            >
                &times;
            </button>

            {(() => {
                const selLabel = selectedOrder.orderId ?? selectedOrder._id ?? selectedOrder.id ?? "-";
                const selDate = selectedOrder.createdAt ?? selectedOrder.date ?? null;
                const selTotal = Number(selectedOrder.total ?? selectedOrder.amount ?? 0) || 0;
                const selRawStatus = (selectedOrder.status ?? selectedOrder.orderStatus ?? "").toString();
                const selStatus = selRawStatus ? selRawStatus.charAt(0).toUpperCase() + selRawStatus.slice(1) : "Unknown";
                const firstImage = getFirstProductImage(selectedOrder);

                const productsArr = Array.isArray(selectedOrder.products)
                    ? selectedOrder.products
                    : Array.isArray(selectedOrder.items)
                    ? selectedOrder.items
                    : [];

                // Extract product names
                const productNames = productsArr
                    .map(p => p.name ?? p.product?.name ?? p.title ?? p.product?.title)
                    .filter(Boolean);

                return (
                    <>
                        <h2 className="text-2xl font-bold mb-3">Order #{selLabel}</h2>

                        {firstImage && (
                            <div className="mb-3 w-full h-44 bg-gray-100 rounded-lg overflow-hidden">
                                <img src={firstImage} alt={`order-${selLabel}-product`} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <p className="mb-2">
                            <strong>Date:</strong>{" "}
                            {selDate ? new Date(selDate).toLocaleDateString() : "-"}
                        </p>

                        <p className="mb-2">
                            <strong>Status:</strong>{" "}
                            <span
                                className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                    selStatus === "Pending"
                                        ? "bg-yellow-500"
                                        : selStatus === "Shipped"
                                        ? "bg-blue-500"
                                        : selStatus === "Delivered"
                                        ? "bg-green-600"
                                        : "bg-red-600"
                                }`}
                            >
                                {selStatus}
                            </span>
                        </p>

                        <p className="mb-2">
                            <strong>Total:</strong> ${selTotal.toFixed(2)}
                        </p>

                        <div className="mb-4 text-sm text-gray-700">
                            <strong>Products:</strong>{" "}
                            {productNames.length > 0
                                ? productNames.join(", ")
                                : "No products information available"}
                        </div>
                    </>
                );
            })()}

            <button
                className="px-5 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
                onClick={closeQuickView}
            >
                View Full Details
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default MyOrder;
