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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL ;

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      await fetchUserProfile();
      await fetchUserOrders();
    };
    init();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.get(`${VITE_BACKEND_URL}/api/user/current`, {
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
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${VITE_BACKEND_URL}/api/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data.orders)) list = res.data.orders;
      else if (Array.isArray(res.data.data)) list = res.data.data;

      setOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.put(`${VITE_BACKEND_URL}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    window.dispatchEvent(new Event("authChanged"));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Resolve image URL
  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  // Get first product image
  const getOrderImage = (order) => {
    if (!order) return null;
    const candidates = [
      
      order.products?.[0]?.image,
    ];

    for (const c of candidates) {
      const url = resolveImageUrl(c);
      if (url) return url;
    }
    return null;
  };

  // Get product names
  const getOrderProductNames = (order) => {
    if (!order) return [];
    const productsArr = order.products ?? order.items ?? [];
    return productsArr
      .map((p) => p.name ?? p.product?.name ?? p.title ?? p.product?.title)
      .filter(Boolean); // remove undefined/null
  };

  const handleQuickView = (order) => {
    setSelectedOrder(order);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setSelectedOrder(null);
    setShowQuickView(false);
  };

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
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded shadow p-6 mb-8">
          {editing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{user.phone || "Not set"}</p>
              </div>
              {user.rol && (
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{user.rol}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order, idx) => {
                const orderKey = order._id ?? order.orderId ?? order.id ?? idx;
                const img = getOrderImage(order);
                const productNames = getOrderProductNames(order);

                return (
                  <div
                    key={orderKey}
                    className="border border-gray-200 rounded p-4 flex flex-col gap-2 hover:shadow-lg transition"
                  >
                    <div className="w-full h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {img ? (
                        <img src={img} alt="Order" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">Order ID</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="font-semibold">#{order.orderId }</p>
                    
                    <p className="text-sm text-gray-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown date"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      Total: ${order.total?.toFixed(2) || "0.00"}
                    </p>

                    {/* Product names */}
                    

                    <button
                      onClick={() => handleQuickView(order)}
                      className="mt-2 bg-pink-600 text-white py-1 rounded hover:bg-pink-700"
                    >
                      Quick View
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeQuickView}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-black"
              onClick={closeQuickView}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-3">
              Order #{selectedOrder.orderId ?? selectedOrder._id ?? "-"}
            </h2>
            <img
              src={getOrderImage(selectedOrder)}
              alt="Order"
              className="w-full h-44 object-cover rounded mb-3"
            />
            <p>
              <strong>Date:</strong>{" "}
              {selectedOrder.createdAt
                ? new Date(selectedOrder.createdAt).toLocaleDateString()
                : "-"}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder.total?.toFixed(2) || "0.00"}
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Products: {getOrderProductNames(selectedOrder).join(", ")}
            </p>
            <button
              onClick={closeQuickView}
              className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
