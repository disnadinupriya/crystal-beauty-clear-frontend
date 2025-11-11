import { Route, Routes, Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdWarehouse } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import AdminProductsPage from "./admin/Products";
import React, { useEffect } from "react";
import { useState } from "react";
import AddProductFrom from "./admin/addProductFrom.jsx";
import EditProductForm from "./admin/editProduct.jsx";
import AdminOrdersPage from "./admin/adminOrders.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function AdminPage() {
const [userValidated, setUserValidated] = useState(false);
const navigate = useNavigate();

useEffect(() => {
  let mounted = true;
  const controller = new AbortController();

  // accept either an explicit adminToken or a general token
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  // try to read a cached user from localStorage (safe parse)
  let cachedUser = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) cachedUser = JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse cached user from localStorage:", e);
  }

  // If we already have a cached admin user, optimistically allow access.
  // Still attempt background validation if a token exists.
  if (cachedUser && (cachedUser.rol === "admin" || cachedUser.role === "admin")) {
    setUserValidated(true);
    if (!token) return; // no token to validate against backend
  }

  // If there's no token and no cached admin user, redirect to login
  if (!token) {
    toast.error("Please login first to access admin panel");
    navigate("/login");
    return;
  }

  (async () => {
    try {
      const base = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";
      const url = `${base.replace(/\/$/, "")}/api/user/current`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      if (!mounted) return;

      console.log("Validation response:", response?.data);
      const data = response?.data || {};

      const isAdmin =
        data?.user?.rol === "admin" ||
        data?.user?.role === "admin" ||
        data?.rol === "admin" ||
        data?.role === "admin";

      if (isAdmin) {
        setUserValidated(true);
      } else {
        toast.error("You are not authorized to access admin panel");
        localStorage.removeItem("adminToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error validating user:", error);
      if (!mounted) return;

      // If backend validation failed but we have a cached admin user, allow access (dev/offline fallback)
      if (cachedUser && (cachedUser.rol === "admin" || cachedUser.role === "admin")) {
        console.warn("Backend validation failed but cached admin user exists - allowing access temporarily.");
        setUserValidated(true);
        return;
      }

      // Otherwise, treat as invalid session
      toast.error("Session validation failed. Please login again.");
      localStorage.removeItem("adminToken");
      setUserValidated(false);
      navigate("/login");
    }
  })();

  return () => {
    mounted = false;
    controller.abort();
  };
}, [navigate]);
  return (
    <div className="w-full h-screen bg-gray-300  flex p-2">
      {userValidated ? (
        <>
          <div className="h-full w-[300px] ">
            <Link
              to="/admin/users"
              className="block p-2 text-red-600 flex item-center "
            >
              <FaUsers className="mr-2 " /> Users
            </Link>
            <Link
              to="/admin/products"
              className="block p-2 text-red-600 flex item-center"
            >
              <MdWarehouse className="mr-2 " />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="block p-2 text-red-600 flex item-center"
            >
              <FaFileInvoice className="mr-2 " /> Orders
            </Link>
          </div>

          <div className="h-full w-[calc(100vw-300px)] bg-white rounded-lg ">
            <Routes>
              <Route path="/admin" element={<h1>Dashboard</h1>} />
              <Route path="/users" element={<h1>Users</h1>} />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/addProduct" element={<AddProductFrom />} />
              <Route path="/editProduct/" element={<EditProductForm />} />
            </Routes>
          </div>
        </>
      ) : (
        <div className="w-full h-screen bg-gray-300 flex justify-center items-center">
          <h1 className="text-2xl font-bold underline">Please Login First</h1>
        </div>
      )}
    </div>
  );
}
