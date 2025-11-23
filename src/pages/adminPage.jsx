import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { FaUsers, FaFileInvoice, FaBars, FaTimes } from "react-icons/fa"; // Added Icons
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
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
    <div className="w-full h-screen bg-gray-100 flex font-sans overflow-hidden">
      {userValidated ? (
        <>
          {/* --- Mobile Sidebar Overlay --- */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* --- Sidebar (Responsive) --- */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-[260px] h-full bg-white shadow-2xl flex flex-col p-4 transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:shadow-xl
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
                {/* Close Button for Mobile */}
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-red-500">
                    <FaTimes size={24} />
                </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link 
                to="/admin/users" 
                onClick={() => setIsSidebarOpen(false)} 
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
                <FaUsers size={20} />
                <span className="font-medium">Users</span>
              </Link>
              <Link 
                to="/admin/products" 
                onClick={() => setIsSidebarOpen(false)} 
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
                <MdWarehouse size={20} />
                <span className="font-medium">Products</span>
              </Link>
              <Link 
                to="/admin/orders" 
                onClick={() => setIsSidebarOpen(false)} 
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
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

          {/* --- Main Content Area --- */}
          <div className="flex-1 h-full flex flex-col overflow-hidden relative">
            
            {/* Mobile Header (Menu Button) */}
            <div className="md:hidden bg-white shadow-sm p-4 flex items-center gap-4 z-30 shrink-0">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 hover:text-blue-600">
                    <FaBars size={24} />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Scrollable Page Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
              <Routes>
                <Route path="/" element={
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MdWarehouse size={60} className="mb-4 text-blue-200" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 text-center">Welcome to Admin Dashboard</h1>
                        <p className="mt-2 text-sm">Select an option from the sidebar to manage your store.</p>
                    </div>
                } />
                <Route path="/users" element={<AdminUsersPage />} />
                <Route path="/products" element={<AdminProductsPage />} />
                <Route path="/orders" element={<AdminOrdersPage />} />
                <Route path="/addProduct" element={<AddProductFrom />} />
                <Route path="/editProduct" element={<EditProductForm />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
           {/* Loading State */}
           <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-blue-600 font-medium animate-pulse">Verifying Admin Access...</p>
           </div>
        </div>
      )}
    </div>
  );
}