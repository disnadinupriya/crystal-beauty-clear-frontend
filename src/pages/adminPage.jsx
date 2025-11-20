import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { FaUsers, FaFileInvoice } from "react-icons/fa";
import { MdWarehouse } from "react-icons/md";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Admin Sub-Pages Import
import AdminProductsPage from "./admin/Products";
import AddProductFrom from "./admin/addProductFrom.jsx";
import EditProductForm from "./admin/editProduct.jsx";
import AdminOrdersPage from "./admin/adminOrders.jsx";
import AdminUsersPage from "./admin/adminUsers.jsx";

export default function AdminPage() {
  const [userValidated, setUserValidated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Token එක check කිරීම
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to access admin panel");
      navigate("/login");
      return;
    }

    // 2. Backend එකෙන් User ව verify කිරීම
    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const user = response.data.user || response.data;

        // Admin ද කියලා check කිරීම
        if (user.rol === "admin" || user.role === "admin") {
          setUserValidated(true);
          // වැදගත්ම දේ: Latest User Data localStorage එකට දානවා.
          // මේකෙන් තමයි අනිත් පිටු වලට data යන්නේ.
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          toast.error("Access Denied: You are not an Admin");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Admin validation failed:", error);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="w-full h-screen bg-gray-100 flex font-sans">
      {userValidated ? (
        <>
          {/* Sidebar */}
          <div className="w-[250px] h-full bg-white shadow-xl flex flex-col p-4">
            <h2 className="text-2xl font-bold text-blue-600 mb-8 px-2">Admin Panel</h2>
            
            <nav className="flex flex-col gap-2">
              <Link to="/admin/users" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                <FaUsers size={20} />
                <span className="font-medium">Users</span>
              </Link>
              <Link to="/admin/products" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                <MdWarehouse size={20} />
                <span className="font-medium">Products</span>
              </Link>
              <Link to="/admin/orders" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                <FaFileInvoice size={20} />
                <span className="font-medium">Orders</span>
              </Link>
            </nav>

            <div className="mt-auto">
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="w-full bg-red-50 text-red-600 p-3 rounded-lg font-medium hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 h-full overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/addProduct" element={<AddProductFrom />} />
              <Route path="/editProduct" element={<EditProductForm />} />
            </Routes>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
           {/* Loading State */}
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}