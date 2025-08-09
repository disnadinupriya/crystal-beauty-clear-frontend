import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function handleRegister() {
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
            firstName,
            lastName,
            email,
            phone,
            password
        }).then((response) => {
            toast.success("Registration successful");
            navigate("/login");
            setLoading(false);
        }).catch((error) => {
            console.log("Registration failed:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Registration failed");
            setLoading(false);
        });
    }

    return (
        <div className='w-full bg-red-600 h-screen
                       bg-[url("loginBg.jpg")]
                       bg-cover
                       bg-center
                       flex'>
            <div className="w-[50%] h-full"></div>
            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[450px] h-[750px] backdrop-blur-lg shadow-2xl rounded-2xl flex flex-col justify-center items-center">

                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-[400px] h-[50px] border border-white rounded-xl m-3 text-center"
                        type="text"
                        placeholder="First Name"
                    />

                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-[400px] h-[50px] border border-white rounded-xl m-3 text-center"
                        type="text"
                        placeholder="Last Name"
                    />

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-[400px] h-[50px] border border-white rounded-xl m-3 text-center"
                        type="email"
                        placeholder="Email"
                    />

                    <input
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-[400px] h-[50px] border border-white rounded-xl m-3 text-center"
                        type="tel"
                        placeholder="Phone"
                    />

                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-[400px] h-[50px] border border-white rounded-xl m-3 text-center"
                        type="password"
                        placeholder="Password"
                    />

                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-[400px] h-[50px] border border-white rounded-xl m-3 text-center"
                        type="password"
                        placeholder="Confirm Password"
                    />

                    <button
                        onClick={handleRegister}
                        className="w-[200px] h-[50px] rounded-2xl m-5 bg-green-600 hover:bg-green-700 cursor-pointer"
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>

                    <p className='text-white'>
                        Already have an account? &nbsp;
                        <span className='text-blue-500 cursor-pointer'>
                            <Link to="/login">Login now</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
