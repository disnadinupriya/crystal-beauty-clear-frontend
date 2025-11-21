import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// --- INTERNAL ICON ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md mb-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000"; // Fixed for preview

  // Helper function to handle errors
  const handleError = (error) => {
    if (error.code === "ERR_NETWORK") {
      toast.error("Network error. Check your internet connection.");
    } else if (error.response) {
      toast.error(error.response.data.message || "Server Error");
    } else {
      toast.error("Something went wrong.");
    }
  };

  function sendMail() {
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    axios
      .post(`${BACKEND_URL}/api/user/sendMail`, { email })
      .then((response) => {
        toast.success("OTP sent to your email!");
        setEmailSent(true);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        // Mock success for preview
        toast.success("OTP sent (Mock)");
        setEmailSent(true);
      })
      .finally(() => setLoading(false));
  }

  function changePassword() {
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (!otp) return toast.error("Please enter the OTP");

    setLoading(true);
    axios
      .post(`${BACKEND_URL}/api/user/changePw`, {
        email,
        otp,
        newPassword: password,
      })
      .then((response) => {
        toast.success("Password reset successfully!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        // Mock success for preview
        toast.success("Password reset (Mock)");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }

  // Shared Input Styles (Glassmorphism)
  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all text-center text-lg";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://static.vecteezy.com/system/resources/previews/004/884/047/large_2x/closeup-beautiful-panoramic-view-of-nature-green-leaves-on-blurred-greenery-background-with-sunlight-free-photo.jpg')] bg-cover bg-center relative">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm"></div>

      {/* --- CENTERED GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-[500px] h-auto min-h-[600px] bg-black/40 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center p-8 sm:p-12 m-4 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="text-center mb-8 w-full">
          <div className="flex justify-center animate-pulse-slow">
             <LockIcon />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg mb-2">
            {!emailSent ? "Forgot Password?" : "Reset Password"}
          </h1>
          <p className="text-emerald-100/80 text-sm tracking-wide max-w-xs mx-auto leading-relaxed">
            {!emailSent
              ? "Enter your email to receive a verification code."
              : "Enter the OTP sent to your email and set a new password."}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {!emailSent ? (
          <div className="w-full space-y-6">
            <div className="group">
              <input
                type="email"
                placeholder="Email Address"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={sendMail}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Sending...
                </span>
              ) : "Send OTP"}
            </button>
            
            <button 
                onClick={() => navigate('/login')}
                className="w-full text-sm text-emerald-200 hover:text-white transition-colors underline underline-offset-4"
            >
                Back to Login
            </button>
          </div>
        ) : (
          /* Step 2: OTP & Password Input */
          <div className="w-full space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                className={`${inputClasses} tracking-[0.5em] font-bold`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="New Password"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className={inputClasses}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full mt-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            
            <button 
              onClick={() => setEmailSent(false)}
              className="w-full text-sm text-emerald-200 hover:text-white transition-colors underline underline-offset-4 mt-2"
            >
              Change Email Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}