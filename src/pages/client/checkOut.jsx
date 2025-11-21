import {
  getCart,
  getTotal,
  getTotalForLablePrice,
} from "../../../utils/cart.js";
import { FaTrashAlt, FaLock, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/header.jsx";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function CheckOutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cart, setCart] = useState(location.state?.item || []);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  async function placeOrder() {
    // basic validation
    if (!name?.trim() || !address?.trim() || !phoneNumber?.trim()) {
      toast.error("Please fill name, address and contact before placing order.");
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const labelTotal = cart.reduce(
      (s, it) => s + (Number(it.lablePrice ?? it.price) || 0) * it.quantity,
      0
    );
    const total = cart.reduce((s, it) => s + (Number(it.price) || 0) * it.quantity, 0);

    const orderData = {
      name,
      address,
      phoneNumber,
      total,
      labelTotal,
      billItems: cart.map((item) => ({
        productid: item.productid,
        productId: item.productid,
        quantity: item.quantity,
        price: Number(item.price) || 0,
      })),
    };

    const token = localStorage.getItem("token");

    try {
      console.log("Placing order, payload:", orderData);
      const url = (import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000").replace(/\/$/, "") + "/api/order";
      const response = await axios.post(url, orderData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      console.log("Order placed successfully:", response.data);
      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      const serverMessage = error?.response?.data?.message || error?.response?.data || error.message;
      toast.error(`Failed to place order: ${serverMessage}`);
    }
  }

  // ✅ Load cart once when page mounts
  useEffect(() => {
    const fromState = location.state?.item;
    if (Array.isArray(fromState) && fromState.length > 0) {
      setCart(fromState);
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(Array.isArray(stored) ? stored : []);
      } catch {
        setCart([]);
      }
    }

    // ✅ Show loading only once
    if (!cartLoaded) {
      setTimeout(() => setCartLoaded(true), 600);
    }
  }, [location.state]);

  // Save cart changes to localStorage
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, cartLoaded]);

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-800 pb-20">
      <Header />

      {/* Decorative Top Background */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-100/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        {/* 🛍️ Page Title */}
        <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-emerald-600 text-2xl border border-emerald-100">
                <FaLock />
            </div>
            <h1 className="text-3xl font-serif text-stone-900">Secure Checkout</h1>
            <p className="text-stone-500 text-sm mt-1">Final step to your beauty journey</p>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* 🧾 RIGHT COLUMN: Order Summary (Displayed first on mobile for context, but visually kept right on desktop) */}
          {/* We use 'order-1' to show it first on mobile, 'lg:order-2' to show it right on desktop */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-6 sm:p-8 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-stone-900">Your Bag</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">{cart.length} Items</span>
              </div>

              {/* 🕒 Loading Skeleton */}
              {!cartLoaded ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-stone-100 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-stone-100 rounded w-3/4"></div>
                        <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cart.length === 0 ? (
                <p className="text-center text-stone-500 py-8 italic">Your cart is empty.</p>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b border-stone-50 last:border-0 group">
                      <div className="relative">
                        <img
                            src={item.Image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl border border-stone-100 shadow-sm"
                        />
                        <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {item.quantity}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                        <p className="text-xs text-stone-500 truncate">{Array.isArray(item.altName) ? item.altName.join(" | ") : item.altName}</p>
                        <div className="flex justify-between items-center mt-1">
                             <p className="text-emerald-600 font-medium text-sm">LKR {item.price.toFixed(2)}</p>
                             {/* Mini Trash Icon */}
                             <button
                                onClick={() => setCart((prev) => prev.filter((c) => c.productid !== item.productid))}
                                className="text-stone-300 hover:text-red-500 transition-colors p-1"
                            >
                                <FaTrashAlt size={12} />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 💰 Totals Section */}
              {cartLoaded && cart.length > 0 && (
                <div className="mt-6 pt-6 border-t-2 border-dashed border-stone-100 space-y-3">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Subtotal</span>
                    <span>LKR {getTotalForLablePrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Discount Savings</span>
                    <span>- LKR {(getTotalForLablePrice() - getTotal()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-stone-100 mt-2">
                    <div>
                        <span className="text-sm text-stone-500 block">Total Amount</span>
                        <span className="text-2xl font-bold text-stone-900">LKR {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📝 LEFT COLUMN: Shipping Form + BUTTON IS HERE */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              
              {/* Form Header */}
              <div className="bg-stone-900 px-8 py-5 flex items-center justify-between">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-400" /> Shipping Details
                </h2>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div className="w-2 h-2 rounded-full bg-stone-600"></div>
                    <div className="w-2 h-2 rounded-full bg-stone-600"></div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Name Input */}
                <div className="group">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-stone-300 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-800 placeholder-stone-400"
                      type="text"
                      placeholder="e.g. Kasun Perera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Address Input */}
                <div className="group">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-stone-300 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-800 placeholder-stone-400"
                      type="text"
                      placeholder="House No, Street, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact Input */}
                <div className="group">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhoneAlt className="text-stone-300 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-800 placeholder-stone-400"
                      type="text"
                      placeholder="07X XXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Privacy Note */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start">
                    <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                    <p className="text-xs text-stone-600 leading-relaxed">
                        We will use this information to deliver your order. Your details are securely stored and never shared.
                    </p>
                </div>

                {/* 🔴 BUTTON PLACED HERE (Under Shipping Info) */}
                {cartLoaded && cart.length > 0 && (
                    <div className="pt-4">
                        <button
                            className="w-full group relative bg-stone-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-stone-300 hover:shadow-emerald-200 transition-all duration-300 overflow-hidden"
                            onClick={placeOrder}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Confirm Order <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Hover effect background */}
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                        
                        <p className="text-center text-[11px] text-stone-400 mt-4 uppercase tracking-wider">
                            Cash on Delivery Available
                        </p>
                    </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}