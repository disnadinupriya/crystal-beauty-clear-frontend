import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// --- INTERNAL ICONS ---
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md mb-2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Backend URL with fallback
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  function handleLogin() {
    if (!email || !password) {
        toast.error("Please enter email and password");
        return;
    }

    setLoading(true);
    
    axios
      .post(`${BACKEND_URL}/api/user/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        toast.success("Login successful");
        
        // Token සහ User Data Save කිරීම
        localStorage.setItem("token", response.data.token);
        
        if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Header update වීමට event එකක්
        window.dispatchEvent(new Event("authChanged"));

        const user = response.data.user || {};
        
        // --- FIX: Check 'rol' instead of 'role' ---
        if (user.rol === "admin" || user.role === "admin") {
            navigate("/admin/products");
        } else {
            navigate("/");
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Login Failed:", error);
        const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
        toast.error(msg);
        setLoading(false);
      });
  }

  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all text-center text-lg";

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://wallpapers.com/images/hd/green-background-thy1fi27vpmfr2n9.jpg')] bg-cover bg-center relative">
    
    {/* Dark Overlay */}
      <div className="absolute inset-0 bg-emerald-700/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-[600px] h-auto min-h-[600px] bg-black/40 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center p-8 sm:p-12 m-4">
        
        {/* Header */}
        <div className="text-center mb-10">
            <div className="flex justify-center animate-bounce-slow">
                <LeafIcon />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white drop-shadow-lg mb-2">Welcome Back</h1>
            <p className="text-emerald-100/80 text-sm tracking-wide">Pure Beauty. Natural Care.</p>
        </div>

        {/* Form */}
        <div className="w-full space-y-6">
            <div className="group">
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className={inputClasses}
                    type="email"
                    placeholder="Email Address"
                />
            </div>

            <div className="group">
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className={inputClasses}
                    type="password"
                    placeholder="Password"
                />
            </div>

            <div className="flex justify-end pr-2">
                <Link to="/forgot-password" class="text-sm text-emerald-200 hover:text-white transition-colors hover:underline underline-offset-4">
                    Forgot Password?
                </Link>
            </div>

            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Logging In...
                    </span>
                ) : "Login"}
            </button>
        </div>

        <p className="text-center text-emerald-100/70 mt-10 text-sm">
            New to MyShop? &nbsp;
            <Link to="/register" className="font-bold text-white hover:text-emerald-300 transition-colors underline underline-offset-4">
                Create an account
            </Link>
        </p>

      </div>
    </div>
  );
}