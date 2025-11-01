import {
  getCart,
  getTotal,
  getTotalForLablePrice,
} from "../../../utils/cart.js";
import { FaTrashAlt } from "react-icons/fa";
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
  function placeOrder() {
    const orderData = {
      name:name,
      address: address,
      phoneNumber: phoneNumber,
      billItems: cart.map((item) => ({
        productid: item.productid,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem("token");

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/order", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Order placed successfully:", response.data);
        toast.success("Order placed successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.");
      });
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

    // ✅ Show loading only once (not every cart update)
    if (!cartLoaded) {
      setTimeout(() => setCartLoaded(true), 600);
    }
  }, [location.state]);

  // Save cart changes to localStorage (no loading reset)
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, cartLoaded]);

  return (
    <div>
      <Header />

      <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-b from-pink-50 to-white py-16 px-6">
        <div className="w-full max-w-[750px]">
          {/* 🛍️ Title */}
          <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
            💳 Checkout
            {!cartLoaded && (
              <span className="ml-3 inline-block w-5 h-5 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></span>
            )}
          </h1>

          {/* 🕒 Loading skeleton */}
          {!cartLoaded ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between border border-gray-100"
                >
                  <div className="w-[95px] h-[95px] bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 ml-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-[80px] h-[20px] bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-20 text-lg">
              Your cart is empty.
            </p>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className="relative w-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg rounded-2xl flex justify-between items-center p-5 mb-5 transition-all duration-300"
              >
                {/* 🗑️ Remove Button */}
                <button
                  className="absolute right-5 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex justify-center items-center shadow-sm hover:scale-110 transition-transform"
                  onClick={() => {
                    setCart((prev) =>
                      prev.filter(
                        (cartItem) => cartItem.productid !== item.productid
                      )
                    );
                  }}
                >
                  <FaTrashAlt className="text-sm" />
                </button>

                {/* 🖼️ Product Image */}
                <img
                  src={item.Image}
                  alt={item.name}
                  className="w-[95px] h-[95px] object-cover rounded-xl shadow-sm ring-1 ring-gray-200"
                />

                {/* 🧾 Product Details */}
                <div className="flex-1 ml-5 overflow-hidden">
                  <p className="font-semibold text-gray-900 text-[17px] truncate">
                    {item.name}
                  </p>
                  {item.altName && (
                    <p className="text-sm text-gray-500 truncate">
                      {Array.isArray(item.altName)
                        ? item.altName.join(" | ")
                        : item.altName}
                    </p>
                  )}
                  <p className="text-sm text-pink-600 font-medium mt-1">
                    LKR {item.price.toFixed(2)}
                  </p>
                </div>

                {/* 🔢 Quantity Controls */}
                <div className="flex flex-col items-center justify-center mr-14">
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      className="bg-gray-800 text-white text-[20px] rounded-full w-[34px] h-[34px] flex justify-center items-center hover:bg-gray-900 hover:scale-110 transition"
                      onClick={() =>
                        setCart((prev) => {
                          const updated = [...prev];
                          updated[index] = {
                            ...updated[index],
                            quantity: Math.max(1, updated[index].quantity - 1),
                          };
                          return updated;
                        })
                      }
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-800 text-[16px]">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-gray-800 text-white text-[20px] rounded-full w-[34px] h-[34px] flex justify-center items-center hover:bg-gray-900 hover:scale-110 transition"
                      onClick={() =>
                        setCart((prev) => {
                          const updated = [...prev];
                          updated[index] = {
                            ...updated[index],
                            quantity: updated[index].quantity + 1,
                          };
                          return updated;
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* 💰 Totals */}
          {cartLoaded && cart.length > 0 && (
            <div className="w-full mt-8 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h1 className="text-lg font-medium text-gray-700">Total</h1>
                <h1 className="text-lg font-semibold text-gray-900">
                  LKR {getTotalForLablePrice().toFixed(2)}
                </h1>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h1 className="text-lg font-medium text-gray-700">Discount</h1>
                <h1 className="text-lg font-semibold text-green-600">
                  - LKR {(getTotalForLablePrice() - getTotal()).toFixed(2)}
                </h1>
              </div>
              <div className="flex justify-between items-center border-t-2 border-gray-300 pt-3">
                <h1 className="text-lg font-bold text-gray-900">Net Total</h1>
                <h1 className="text-lg font-bold text-pink-600">
                  LKR {getTotal().toFixed(2)}
                </h1>
              </div>
            </div>
          )}
          <div className=" ">
            <h1>Name</h1>
            <input
              className="w-full h-10 border border-gray-300 rounded-md px-3"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className=" ">
            <h1>Address</h1>
            <input
              className="w-full h-10 border border-gray-300 rounded-md px-3"
              type="text"
              placeholder="Your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className=" ">
            <h1>Contact</h1>
            <input
              className="w-full h-10 border border-gray-300 rounded-md px-3"
              type="text"
              placeholder="Your Contact"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>


          {/* 🧾 Place Order Button */}
          {cartLoaded && cart.length > 0 && (
            <div className="w-full flex justify-end mt-6">
              <button
                className="w-[190px] py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={placeOrder}
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
