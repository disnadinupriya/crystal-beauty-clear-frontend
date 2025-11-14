import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function sendMail() {
    if (!email) return toast.error("Please enter your email");

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/sendMail`, {
        email: email,
      })
      .then((response) => {
        console.log("Email sent successfully:", response.data);
        toast.success("OTP sent to your email!");
        setEmailSent(true);
        
        
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        toast.error("Failed to send email. Try again.");
      });
  }

  function changePassword() {
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/changePw`, {
        email: email,
        otp: otp,
        newPassword: password,
      })
      .then((response) => {
        console.log("Password reset successfully:", response.data);
        toast.success("Password reset successfully!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        toast.error("Failed to reset password. Try again.");
      })
    };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {!emailSent ? (
        /* ----------------- STEP 1: ENTER EMAIL ----------------- */
        <div className="bg-white p-6 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

          <label className="block mb-2 font-medium">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border border-gray-300 rounded-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white mt-4 py-2 rounded-md w-full font-semibold"
            onClick={sendMail}
          >
            Send OTP
          </button>
        </div>
      ) : (
        /* ----------------- STEP 2: ENTER OTP + NEW PASSWORD ----------------- */
        <div className="bg-white p-6 rounded-xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

          <label className="block mb-2 font-medium">OTP:</label>
          <input
            type="text"
            placeholder="Enter OTP"
            className="p-2 border border-gray-300 rounded-md w-full"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <label className="block mb-2 mt-4 font-medium">New Password:</label>
          <input
            type="password"
            placeholder="New Password"
            className="p-2 border border-gray-300 rounded-md w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block mb-2 mt-4 font-medium">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="p-2 border border-gray-300 rounded-md w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="bg-green-600 hover:bg-green-700 text-white mt-4 py-2 rounded-md w-full font-semibold"
            onClick={changePassword}

          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
