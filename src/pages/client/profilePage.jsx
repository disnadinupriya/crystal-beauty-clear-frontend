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
  
  // FIX 1: Variable naming consistency & Fallback
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      await fetchUserProfile(token);
      await fetchUserOrders(token);
    };
    init();
  }, []);

  // Helper to handle 401 Unauthorized errors
  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      console.warn("Session expired. Logging out.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));
      navigate("/login");
      toast.error("Session expired. Please login again.");
    } else {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      // FIX 2: Use `backendUrl` correctly here
      const res = await axios.get(`${backendUrl}/api/user/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.user || res.data;
      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async (token) => {
    try {
      // FIX 3: Use `backendUrl` correctly here too
      const res = await axios.get(`${backendUrl}/api/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data.orders)) list = res.data.orders;
      
      setOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
      // Don't redirect on order fetch fail, just log it
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

      const res = await axios.put(`${backendUrl}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data;
      setUser(updatedUser);
      // Update Local Storage User Data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      handleAuthError(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Resolve image URL
  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (path.startsWith("http")) return path;
    return `${backendUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  // Get first product image
  const getOrderImage = (order) => {
    if (!order) return null;
    // Check billItems or products array
    const items = order.billItems || order.products || [];
    if (items.length > 0) {
        const firstItem = items[0];
        // Check various image property locations
        const img = firstItem.Image || firstItem.image;
        
        // If it's an array, take the first one
        if (Array.isArray(img) && img.length > 0) return resolveImageUrl(img[0]);
        if (typeof img === 'string') return resolveImageUrl(img);
    }
    return null;
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
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account & orders</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
             {!editing && (
                 <button 
                    onClick={() => setEditing(true)} 
                    className="text-emerald-600 font-medium hover:underline"
                 >
                    Edit
                 </button>
             )}
          </div>

          {editing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Full Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email Address</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phone Number</p>
                <p className="text-lg font-medium text-gray-900">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Role</p>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full">
                    {user.rol || "User"}
                </span>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order History</h2>
          {orders.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-2">You haven't placed any orders yet.</p>
                <button onClick={() => navigate("/products")} className="text-emerald-600 font-medium hover:underline">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const orderId = order.orderId || order._id;
                return (
                  <div
                    key={order._id || idx}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {getOrderImage(order) ? (
                                <img src={getOrderImage(order)} alt="Product" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Order #{typeof orderId === 'string' ? orderId.slice(-6).toUpperCase() : orderId}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                        <p className="font-bold text-gray-900">LKR {(order.total || 0).toFixed(2)}</p>
                        <button 
                            onClick={() => handleQuickView(order)}
                            className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        >
                            View
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeQuickView}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-emerald-900 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold">Order Details</h3>
                <button onClick={closeQuickView} className="hover:text-emerald-200">✕</button>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-bold text-lg">#{selectedOrder.orderId || selectedOrder._id}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Items</p>
                    <ul className="mt-1 space-y-1">
                        {(selectedOrder.billItems || selectedOrder.products || []).map((item, i) => (
                            <li key={i} className="text-sm font-medium text-gray-800 flex justify-between">
                                <span>• {item.name || item.product?.name || "Product"} (x{item.quantity || 1})</span>
                                <span>{item.price ? `LKR ${item.price}` : ""}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                    <span className="font-bold text-gray-500">Total Paid</span>
                    <span className="font-bold text-xl text-emerald-600">LKR {(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
                <button onClick={closeQuickView} className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
                    Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}