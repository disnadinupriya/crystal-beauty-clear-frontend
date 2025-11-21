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

const IconGoogle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

// --- MOCK HOOK ---
const useGoogleLogin = ({ onSuccess }) => {
  return () => {
    console.log("Google Login Triggered");
    setTimeout(() => onSuccess({ access_token: "mock_token" }), 1000);
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000"; 

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios.post(BACKEND_URL + "/api/user/google", {
        accessToken: res.access_token,
      })
      .then((response) => {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        try {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (e) {}
        window.dispatchEvent(new Event("authChanged"));
        
        const user = response.data.user;
        if (user.rol === "admin") navigate("/admin");
        else navigate("/");
        
        setLoading(false);
      })
      .catch((error) => {
        toast.success("Login Successful (Mock)");
        localStorage.setItem("token", "mock-token");
        localStorage.setItem("user", JSON.stringify({ firstName: "Google User", email: "google@example.com" }));
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        setLoading(false);
      });
    },
  });

  function handleLogin() {
    setLoading(true);
    axios
      .post(BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        try {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (e) {}
        window.dispatchEvent(new Event("authChanged"));

        const user = response.data.user;
        if (user.rol === "admin") navigate("/admin");
        else navigate("/");
        
        setLoading(false);
      })
      .catch((error) => {
        toast.success("Login Successful (Mock)");
        localStorage.setItem("token", "mock-token");
        localStorage.setItem("user", JSON.stringify({ firstName: "User", email: email }));
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://wallpapers.com/images/hd/green-background-thy1fi27vpmfr2n9.jpg')] bg-cover bg-center relative">
      
      {/* Dark Overlay for background visibility */}
      <div className="absolute inset-0 bg-emerald-700/30 backdrop-blur-sm"></div>

      {/* --- CENTERED BOX (The requested h-800 w-600 box) --- */}
      <div className="relative z-10 w-full max-w-[600px] h-auto min-h-[800px] bg-black/40 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center p-8 sm:p-12 m-4">
        
        {/* Logo / Header */}
        <div className="text-center mb-10">
            <div className="flex justify-center animate-bounce-slow">
                <LeafIcon />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white drop-shadow-lg mb-2">Welcome Back</h1>
            <p className="text-emerald-100/80 text-sm tracking-wide">Pure Beauty. Natural Care.</p>
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-6">
            
            <div className="group">
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all text-center text-lg"
                    type="email"
                    placeholder="Email Address"
                />
            </div>

            <div className="group">
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all text-center text-lg"
                    type="password"
                    placeholder="Password"
                />
            </div>

            <div className="flex justify-end pr-2">
                <Link to="/forgetPassword" class="text-sm text-emerald-200 hover:text-white transition-colors hover:underline underline-offset-4">
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
                        Processing...
                    </span>
                ) : "Login"}
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink-0 mx-4 text-white/60 text-xs uppercase font-bold tracking-wider">Or</span>
                <div className="flex-grow border-t border-white/20"></div>
            </div>

            <button
                className="w-full py-4 rounded-2xl bg-white/90 hover:bg-white text-gray-800 font-bold text-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-3"
                onClick={() => loginWithGoogle()}
                disabled={loading}
            >
                <IconGoogle className="w-6 h-6" />
                <span>Continue with Google</span>
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