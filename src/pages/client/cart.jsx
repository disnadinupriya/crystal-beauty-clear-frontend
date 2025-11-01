import {
  addToCart,
  getCart,
  getTotal,
  getTotalForLablePrice,
  removeFromCart,
} from "../../../utils/cart.js";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ✅ Load cart only once when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      const cartItems = getCart();
      setCart(cartItems);
      setCartLoaded(true);
    }, 600); // slight delay for smooth skeleton animation
    return () => clearTimeout(timer);
  }, []);

  // 🧾 Handle removing, adding, and updating cart items
  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart()); // update UI immediately
  };

  const handleQuantityChange = (item, change) => {
    addToCart(item, change);
    setCart(getCart()); // update UI immediately
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-b from-pink-50 to-white py-16 px-6">
      <div className="w-full max-w-[750px]">
        {/* 🛒 Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          🛒 Your Cart
          {!cartLoaded && (
            <span className="ml-3 inline-block w-5 h-5 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></span>
          )}
        </h1>

        {/* 🕒 Loading Skeleton */}
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
              className="relative w-full bg-white border border-gray-100 shadow-sm hover:shadow-lg rounded-2xl flex justify-between items-center p-5 mb-5 transition-all duration-300"
            >
              {/* 🗑️ Remove Button */}
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex justify-center items-center shadow-md hover:scale-110 transition"
                onClick={() => handleRemove(item.productid)}
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
                    onClick={() => handleQuantityChange(item, -1)}
                  >
                    −
                  </button>
                  <span className="font-semibold text-gray-800 text-[16px]">
                    {item.quantity}
                  </span>
                  <button
                    className="bg-gray-800 text-white text-[20px] rounded-full w-[34px] h-[34px] flex justify-center items-center hover:bg-gray-900 hover:scale-110 transition"
                    onClick={() => handleQuantityChange(item, 1)}
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

        {/* 💰 Totals + Checkout */}
        {cartLoaded && cart.length > 0 && (
          <>
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

            <div className="w-full flex justify-end mt-6">
              <button
                className="w-[190px] py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={() => navigate("/checkout", { item: cart })}
              >
                Check Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
