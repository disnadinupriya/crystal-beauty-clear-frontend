import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
// Assuming getCart, getTotalForLablePrice, removeFromCart are correctly imported
import getCart, { getTotalForLablePrice, removeFromCart } from "../../../utils/cart"; 
import axios from "axios";

export default function CheckOutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Load cart from state (if passed) or localStorage
    const [cart, setCart] = useState(location.state?.item || getCart());

    // Update localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Handle item removal
    const handleRemove = (productid) => {
        const updatedCart = removeFromCart(productid);
        setCart(updatedCart);
        toast.success("🗑️ Item removed from cart");
    };
    
    // Handle quantity change
    const handleQuantityChange = (productid, change) => {
        const newCart = cart.map(item => {
            if (item.productid === productid) {
                const newQuantity = item.quantity + change;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        });
        setCart(newCart);
    };

    function PlaceOrder(){
        // Data structure matching the backend controller's expectations
        const orderData = {
            name: "Test User",
            address: "123 Test St, Test City",
            phone: "123-456-7890", // Matches backend's 'phonNumber' field
            items: [], // Matches backend's loop over 'body.items'
        };
        
        // Populate the items array with necessary data (productid and quantity)
        for (let i=0; i<cart.length; i++){
            orderData.items[i] = {
                productid: cart[i].productid,
                quantity: cart[i].quantity,
            }
        }

        const token = localStorage.getItem("token");
        
        console.log("Data being sent to server:", orderData);

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order`, orderData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => { // Response data not strictly needed here
            toast.success("Order placed successfully!");
            localStorage.removeItem("cart"); // Clear cart on success
            navigate("/"); // Redirect home or to an orders page
        })
        .catch((error) => {
            toast.error("Failed to place order. Please try again.");
            // Log the specific error response for quick diagnosis
            console.error("Order placement error:", error.response?.data || error.message, error); 
        });
    }

    // Totals calculation
    const labelTotal = getTotalForLablePrice();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = labelTotal - total;

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
                        {/* Cart Items Mapping (JSX) */}
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productid}
                                    className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-lg transition-shadow"
                                >
                                    {/* Item details */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-[70px] h-[70px] object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="max-w-[250px] overflow-hidden">
                                            <p className="font-bold text-gray-800 truncate">{item.name}</p>
                                            <p className="text-sm text-amber-600 font-medium">
                                                LKR {item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.productid, -1)}
                                                className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex items-center justify-center"
                                            > - </button>
                                            <span className="font-semibold text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.productid, 1)}
                                                className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex items-center justify-center"
                                            > + </button>
                                        </div>
                                    </div>

                                    <p className="text-lg font-semibold text-gray-800">
                                        LKR {(item.price * item.quantity).toFixed(2)}
                                    </p>

                                    <button
                                        onClick={() => handleRemove(item.productid)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                    > Remove </button>
                                </div>
                            ))}
                        </div>

                        {/* Totals Section */}
                        <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-bold text-gray-800">Net Total:</p>
                                <p className="text-2xl font-extrabold text-amber-700 border-b-[4px] border-gray-600">
                                    LKR {total.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={PlaceOrder}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-10 rounded-xl shadow-md transition-colors"
                            >
                                Place Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}