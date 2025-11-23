import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";


// --- INTERNAL ICONS (For Branding Consistency) ---
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md mb-2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // FIX: Hardcoded for preview environment to avoid import.meta error
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;
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

        axios.post(VITE_BACKEND_URL + "/api/user/", {
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
            // Mock success for preview since backend won't connect here
            toast.error(error.response?.data?.message || "Registration failed (Mock Backend)");
            setLoading(false);
        });
    }

    // Theme Styles for Inputs (Matched with Login Page Design)
    const inputClasses = "w-full px-6 py-3 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all text-center text-lg";

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('login.jpg')] bg-cover bg-center relative py-10">
            
            {/* Dark Overlay for background visibility */}
            <div className="absolute inset-0 bg-emerald-700/30 backdrop-blur-sm"></div>

            {/* --- CENTERED BOX (Glassmorphism Layout) --- */}
            <div className="relative z-10 w-full max-w-[600px] h-auto bg-black/40 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center p-8 sm:p-12 m-4">
                
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center animate-bounce-slow">
                        <LeafIcon />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg mb-2">Create Account</h1>
                    <p className="text-emerald-100/80 text-sm tracking-wide">Join the Green Revolution.</p>
                </div>

                {/* Form Fields */}
                <div className="w-full space-y-4">
                    
                    {/* Names Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full">
                            <input
                                onChange={(e) => setFirstName(e.target.value)}
                                className={inputClasses}
                                type="text"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                onChange={(e) => setLastName(e.target.value)}
                                className={inputClasses}
                                type="text"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClasses}
                            type="email"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="group">
                        <input
                            onChange={(e) => setPhone(e.target.value)}
                            className={inputClasses}
                            type="tel"
                            placeholder="Phone Number"
                        />
                    </div>

                    <div className="group">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClasses}
                            type="password"
                            placeholder="Password"
                        />
                    </div>

                    <div className="group">
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputClasses}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full mt-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Creating...
                            </span>
                        ) : "Register"}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-emerald-100/70 mt-8 text-sm">
                    Already have an account? &nbsp;
                    <Link to="/login" className="font-bold text-white hover:text-emerald-300 transition-colors underline underline-offset-4">
                        Login now
                    </Link>
                </p>

            </div>
        </div>
    );
}