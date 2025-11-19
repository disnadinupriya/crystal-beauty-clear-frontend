import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrders();
    }, []);

    async function fetchUserProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }

            const res = await axios.get(`${backendUrl}/api/user/current`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = res.data;
            setUser(userData);
            setFormData({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phone: userData.phone || "",
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
            const cachedUser = localStorage.getItem("user");
            if (cachedUser) {
                const userData = JSON.parse(cachedUser);
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                });
            } else {
                toast.error("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    }

    async function fetchUserOrders() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(`${backendUrl}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(res.data || []);
        } catch (err) {
            // Silently handle errors - endpoint may not be available
            console.error("Error fetching orders:", err);
        }
    }

    async function handleUpdateProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login first");
                return;
            }

            const res = await axios.put(
                `${backendUrl}/api/user/profile`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedUser = res.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setEditing(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        window.dispatchEvent(new Event("authChanged"));
        toast.success("Logged out successfully");
        navigate("/login");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No profile data available</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your account information
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded shadow p-6 mb-8">
                    {editing ? (
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, firstName: e.target.value })
                                        }
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lastName: e.target.value })
                                        }
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleUpdateProfile}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                                        "Not set"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.email || "Not set"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.phone || "Not set"}
                                </p>
                            </div>

                            {user.rol && (
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">
                                        {user.rol}
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mb-3"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders found</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="border border-gray-200 rounded p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-semibold text-gray-900">{order._id}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                            order.status === "completed" ? "bg-green-100 text-green-800" :
                                            order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                            order.status === "cancelled" ? "bg-red-100 text-red-800" :
                                            "bg-blue-100 text-blue-800"
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Date: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        Total: ${order.total?.toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}