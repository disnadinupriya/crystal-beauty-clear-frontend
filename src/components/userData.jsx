import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserState() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    
    // Token එක නැත්නම් කෙලින්ම user null කරන්න
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      
      const res = await axios.get(`${backendUrl}/api/user/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // දත්ත එන ආකාරය අනුව (res.data.user හෝ res.data)
      const userData = res.data.user || res.data;
      
      if (userData) {
        setUser(userData);
        // Cache එක update කිරීම
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      
      // --- FIX: 401 ආවොත් Auto Logout කිරීම ---
      if (error.response && error.response.status === 401) {
        console.warn("Session expired or invalid token. Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        // පිටුව refresh කිරීම හෝ login එකට යැවීම අවශ්‍ය නම් මෙතන ලියන්න පුළුවන්
      } else {
        // වෙනත් error එකක් නම්, cache එකෙන් පෙන්වන්න උත්සාහ කරන්න
        try {
          const raw = localStorage.getItem("user");
          if (raw) setUser(JSON.parse(raw));
        } catch (e) {
          setUser(null);
        }
      }
    }
  };

  useEffect(() => {
    fetchUser();

    // Login/Logout වෙනකොට update වෙන්න
    const handler = () => fetchUser();
    window.addEventListener("authChanged", handler);
    window.addEventListener("storage", handler); // Tab මාරු වෙනකොට update වෙන්න

    return () => {
      window.removeEventListener("authChanged", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Helper functions for UI
  const getUserName = () => user?.firstName || user?.email || "U";
  const getDisplayName = () => user?.firstName || user?.email?.split('@')[0] || "User";

  return (
    <div className="flex items-center">
      {!user ? (
        // --- LOGGED OUT STATE ---
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-emerald-200 hover:text-white text-sm font-medium transition-colors tracking-wide">
            Login
          </Link>
          <Link to="/register" className="bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105">
            Register
          </Link>
        </div>
      ) : (
        // --- LOGGED IN STATE ---
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-400/50 flex items-center justify-center overflow-hidden shadow-inner">
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

          <div className="h-6 w-px bg-emerald-200 mx-1"></div>

          <button
            className="text-red-300 hover:text-red-100 hover:bg-red-500/20 p-1.5 rounded-lg transition-all"
            title="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.dispatchEvent(new Event("authChanged"));
              setUser(null);
              window.location.href = "/login";
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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