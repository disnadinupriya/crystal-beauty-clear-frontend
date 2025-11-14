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
      const base = import.meta.env.VITE_BACKEND_URL ?? "";
      const res = await axios.get((base.replace(/\/$/, "") || "") + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User fetched successfully:", res.data);
      setUser(res.data.user);
      // ensure cached user is present
      try {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // fallback: try to read cached user
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
    // fetch initially
    fetchUser();

    // handler to re-fetch on auth changes (same tab via custom event or other tabs via storage event)
    const handler = () => fetchUser();
    window.addEventListener("authChanged", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("authChanged", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return (
    <>
      {user === null ? (
        <div className="flex  items-center justify-center bg-blue-200 rounded-xl px-2 py-2 ">
          <Link
            to="/login"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-semibold transition mr-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-semibold transition "
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-green-200 rounded-xl px-4 py-2">
          <button
            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              // notify other components
              window.dispatchEvent(new Event("authChanged"));
              // redirect to login
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
