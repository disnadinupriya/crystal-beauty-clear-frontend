import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import register from "./client/register";
import { useGoogleLogin } from "@react-oauth/google";
import { GrGoogle } from "react-icons/gr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
        accessToken: res.access_token,
      })
      .then((response) => {
        console.log(" Login successful:", response.data);
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        // cache user for quick header updates and offline/development fallback
        try {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (e) {
          console.warn("Failed to cache user in localStorage:", e);
        }
        // notify other parts of the app that auth changed
        window.dispatchEvent(new Event("authChanged"));
        console.log(localStorage.getItem("token"));

        const user = response.data.user;
        if (user.rol === "admin") {
          // window.location.href = "/admin";
          navigate("/admin");
        } else {
          //window.location.href = "/";
          navigate("/");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Login failed:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "Login failed");
        setLoading(false);
      });
    },
  });

  function handleLogin() {
    setLoading(true);

    console.log("login button clicked");
    console.log("email:", email);
    console.log("password:", password);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(" Login successful:", response.data);
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        try {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (e) {
          console.warn("Failed to cache user in localStorage:", e);
        }
        window.dispatchEvent(new Event("authChanged"));
        console.log(localStorage.getItem("token"));

        const user = response.data.user;
        if (user.rol === "admin") {
          // window.location.href = "/admin";
          navigate("/admin");
        } else {
          //window.location.href = "/";
          navigate("/");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Login failed:", error.response.data.massage);
        toast.error(error.response.data.message || "Login failed");
        setLoading(false);
      });
  }

  return (
    <div
      className='w-full bg-red-600 h-screen
                       bg-[url("loginBg.jpg")]
                       bg-cover
                       bg-center
                       flex'
    >
      <div className=" w-[50%] h-full"></div>
      <div className=" w-[50%]  h-full flex justify-center items-center">
        <div className="w-[450px] h-[600px] backdrop-blur-lg  shadow-2xl rounded-2xl flex flex-col justify-center items-center">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
              console.log(e.target.value);
            }}
            className="w-[400px] h-[50px] border border-white rounded-xl m-5 text-center "
            type="email"
            placeholder=" email"
          />

          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-[400px] h-[50px] rounded-xl m-5 border border-white text-center"
            type="password"
            placeholder="password"
          />
          <button
            onClick={handleLogin}
            className="w-[200px] h-[50px] rounded-2xl m-5 bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            {loading ? " Loading..." : "Login"}
          </button>

          <button
            className="w-[200px] h-[50px] rounded-2xl m-5 bg-green-600 hover:bg-green-700 cursor-pointer flex justify-center items-center"
            onClick={() => loginWithGoogle()}
          >
            <GrGoogle className="mr-2" />
            {loading ? "Loding..." : "Login with Google"}
          </button>

          <p className="text-white">
            Don't have an account? &nbsp;
            <span className="text-blue-500 cursor-pointer">
              <Link to="/register">Register now</Link>
            </span>
            </p>
            {/*FORGET PASSWORD LINK*/}
            <p className="text-white mt-4">
            Forgot your password? &nbsp;
            <span className="text-blue-500 cursor-pointer">
              <Link to="/forgetPassword">Reset Password</Link>
            </span>
            </p>

          
        </div>
      </div>
    </div>
  );
}
