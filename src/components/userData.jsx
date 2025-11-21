import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserState() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      // Use environment variable with fallback, ensuring no trailing slash issues
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const base = backendUrl.replace(/\/$/, "");
      
      const res = await axios.get(base + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User fetched successfully:", res.data);
      
      // Handle potential response variations (res.data.user vs res.data)
      const userData = res.data.user || res.data;
      
      if (userData) {
        setUser(userData);
        // Update cache
        try {
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (e) { /* ignore */ }
      } else {
        // If response is valid but empty/weird, log out
        setUser(null);
      }

    } catch (error) {
      console.error("Error fetching user:", error);
      // Fallback to cache
      try {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
        else setUser(null);
      } catch (e) {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    fetchUser();

    const handler = () => fetchUser();
    window.addEventListener("authChanged", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("authChanged", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Helper to safely get name for avatar
  const getUserName = () => {
    if (!user) return "U";
    return user.firstName || user.email || "U";
  };

  // Helper to safely get display name
  const getDisplayName = () => {
    if (!user) return "User";
    return user.firstName || user.email?.split('@')[0] || "User";
  };

  return (
    <div className="flex items-center">
      {/* Check for !user handles both null and undefined safely */}
      {!user ? (
        // --- LOGGED OUT STATE ---
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-emerald-200 hover:text-white text-sm font-medium transition-colors tracking-wide"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105"
          >
            Register
          </Link>
        </div>
      ) : (
        // --- LOGGED IN STATE ---
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-400/50 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Generate initial avatar or show user img */}
                <img 
                    src={`https://ui-avatars.com/api/?name=${getUserName()}&background=065f46&color=ecfdf5`} 
                    alt="User" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider leading-none">Hello</span>
                <span className="text-sm font-serif font-medium text-white leading-tight max-w-[100px] truncate">
                    {getDisplayName()}
                </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-emerald-200 mx-1"></div>

          {/* Logout Button */}
          <button
            className="text-red-300 hover:text-red-100 hover:bg-red-500/20 p-1.5 rounded-lg transition-all"
            title="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              // Notify other components
              window.dispatchEvent(new Event("authChanged"));
              // Redirect
              window.location.href = "/login";
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg"color="yellow" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}