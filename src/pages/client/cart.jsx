import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import getCart, { addToCart, getTotalForLablePrice, removeFromCart } from "../../../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  // Remove item
  const handleRemove = (productid) => {
    const updatedCart = removeFromCart(productid);
    setCart(updatedCart);
    toast.success("🗑️ Item removed from cart");
  };

  // Change quantity
  const handleQuantityChange = (product, delta) => {
    const updatedCart = cart.map((item) => {
      if (item.productid === product.productid) {
        let newQty = item.quantity + delta;
        if (newQty < 1) newQty = 1; // prevent less than 1
        const updatedItem = { ...item, quantity: newQty };
        addToCart(updatedItem, 0, true); // update localStorage
        return updatedItem;
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty 😔");
      return;
    }
    navigate("/checkout");
  };

  // Calculate totals
  const labelTotal = getTotalForLablePrice();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = labelTotal - total; // ✅ fix: subtract correctly

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-amber-100 to-yellow-50 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛒 Your Cart</h1>

      <div className="w-full max-w-[650px] bg-white rounded-2xl shadow-xl p-6">
        {cart.length === 0 ? (
          <p className="text-center text-lg font-semibold text-gray-600 py-10">
            Your cart is empty 😔
          </p>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productid}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[70px] h-[70px] object-cover rounded-lg shadow-sm"
                    />
                    <div className="max-w-[250px] overflow-hidden">
                      <p className="font-bold text-gray-800 truncate">{item.name}</p>
                      {item.altName && (
                        <p className="text-sm text-gray-500 truncate">
                          {Array.isArray(item.altName) ? item.altName.join(" | ") : item.altName}
                        </p>
                      )}
                      <p className="text-sm text-amber-600 font-medium">
                        LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-lg font-semibold text-gray-800">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleRemove(item.productid)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-700">Subtotal:</p>
                <p className="text-lg font-bold text-gray-800">
                  LKR {labelTotal.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-700 ">Discount:</p>
                <p className="text-lg font-bold text-green-600 border-b border-gray-600">
                  - LKR {discount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-gray-800">Net Total:</p>
                <p className="text-2xl font-extrabold text-amber-700 border-b-[4px]  border-gray-600">
                  LKR {total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-8 flex justify-center">
  <button
    onClick={() => navigate("/checkout", { state: { item: cart } })}
    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-10 rounded-xl shadow-md transition-colors"
  >
    Proceed to Checkout
  </button>
</div>

          </>
        )}
      </div>
    </div>
  );
}
