import {
    addToCart,
    getTotal,
    getTotalForLablePrice,
} from "../../../utils/cart.js";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../components/header.jsx";

export default function CheckOutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [cartLoaded, setCartLoaded] = useState(false);
    const [cart, setCart] = useState(location.state?.item || []);

    // Load cart on mount: prefer location.state, fallback to localStorage
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
        setCartLoaded(true);
    }, [location.state]);

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        if (cartLoaded) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, cartLoaded]);

    return (
        <div>
            <Header />
        <div className="min-h-screen w-full flex justify-center items-start bg-white py-16 px-6">
            
            <div className="w-full max-w-[700px]">
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500 mt-20 text-lg">
                        Your cart is empty.
                    </p>
                ) : (
                    cart.map((item, index) => (
                        <div
                            key={index}
                            className="relative w-full bg-white border border-gray-200 shadow-md rounded-xl flex justify-between items-center p-4 mb-4 hover:shadow-lg transition-all duration-300"
                        >
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex justify-center items-center transition"
                                onClick={() => {
                                    const newCart = cart.filter(
                                        (cartItem) =>
                                            cartItem.productid !== item.productid
                                    );
                                    setCart(newCart);
                                    setCartLoaded(false);
                                }}
                            >
                                <FaTrashAlt className="text-sm" />
                            </button>

                            <img
                                src={item.Image}
                                alt={item.name}
                                className="w-[90px] h-[90px] object-cover rounded-md shadow-sm"
                            />

                            <div className="flex-1 ml-4 overflow-hidden">
                                <p className="font-semibold text-gray-800 text-[16px] truncate">
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

                            <div className="flex flex-col items-center justify-center mr-14">
                                <div className="flex items-center space-x-2 mb-2">
                                    <button
                                        className="bg-black text-white text-[20px] rounded-full w-[30px] h-[30px] flex justify-center items-center hover:scale-105 transition"
                                        onClick={() => {
                                            const newCart = [...cart];
                                            newCart[index] = {
                                                ...newCart[index],
                                                quantity: Math.max(
                                                    1,
                                                    (newCart[index].quantity || 1) - 1
                                                ),
                                            };
                                            setCart(newCart);
                                            setCartLoaded(false);
                                        }}
                                    >
                                        −
                                    </button>
                                    <span className="font-semibold text-gray-800 text-[16px]">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="bg-black text-white text-[20px] rounded-full w-[30px] h-[30px] flex justify-center items-center hover:scale-105 transition"
                                        onClick={() => {
                                            // update local cart state; avoid duplicate side-effects if addToCart manages localStorage
                                            const newCart = [...cart];
                                            newCart[index] = {
                                                ...newCart[index],
                                                quantity: (newCart[index].quantity || 1) + 1,
                                            };
                                            setCart(newCart);
                                            setCartLoaded(false);
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-gray-800 font-semibold">
                                    LKR {(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div className="w-full flex justify-end">
                    <h1 className=" text-[20px] font-semibold text-black py-2 px-4 mr-4 ">
                        Total
                    </h1>
                    <h1 className=" text-[20px] font-semibold  text-black py-2 px-4 mr-4">
                        LKR{getTotalForLablePrice().toFixed(2)}
                    </h1>
                </div>
                <div className="w-full flex justify-end">
                    <h1 className=" text-[20px] font-semibold text-black py-2 px-4 mr-4 ">
                        Discount
                    </h1>
                    <h1 className=" text-[20px] font-semibold  text-black py-2 px-4 mr-4">
                        LKR{(getTotalForLablePrice() - getTotal()).toFixed(2)}
                    </h1>
                </div>
                <div className="w-full flex justify-end">
                    <h1 className=" text-[20px] font-semibold text-black py-2 px-4 mr-4 ">
                        Net Total
                    </h1>
                    <h1 className=" text-[20px] font-semibold  text-black py-2 px-4 mr-4 border-double border-b-4 border-t">
                        LKR{getTotal().toFixed(2)}
                    </h1>
                </div>
                <div className="w-full flex justify-end  ">
                    <button
                        className="w-[170px] text-xl text-end pr-2 cursor-pointer bg-pink-600"
                        onClick={() => {
                            navigate("/checkout", {
                                state: { item: cart },
                            });
                        }}
                    >
                        Check Out
                    </button>
                </div>
            </div>
        </div></div>
    );
}
