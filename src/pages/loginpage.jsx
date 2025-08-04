import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleLogin() {
        console.log("login button clicked");
        console.log("email:", email);
        console.log("password:", password);

        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/user/login", {
            email: email,
            password: password
        }).then((response) => {
            console.log(" Login successful:", response.data);
            toast.success("Login successful");
            localStorage.setItem("token",response.data.token);
            console.log(localStorage.getItem("token"));

            const user = response.data.user;
            if (user.rol === "admin") {
               // window.location.href = "/admin";
                navigate("/admin");
            } else {
                //window.location.href = "/";
                navigate("/");  
            }

        }).catch((error) => {
            console.log("Login failed:", error.response.data.massage);
            toast.error(error.response.data.message || "Login failed");

        });
    }

    return (
        <div className='w-full bg-red-600 h-screen
                       bg-[url("loginBg.jpg")]
                       bg-cover
                       bg-center
                       flex'>
            <div className = " w-[50%] h-full"></div>
            <div className = " w-[50%]  h-full flex justify-center items-center" >
                <div className = "w-[450px] h-[600px] backdrop-blur-lg  shadow-2xl rounded-2xl flex flex-col justify-center items-center">

                    <input onChange={
                        (e) => {
                            setEmail(e.target.value);
                            console.log(e.target.value);
                        }
                    }
                    className = "w-[400px] h-[50px] border border-white rounded-xl m-5 text-center " type="email" placeholder =" email"
                    />

                    <input onChange={
                        (e) => {
                            setPassword(e.target.value);
                        }
                    } 
                     className = "w-[400px] h-[50px] rounded-xl m-5 border border-white text-center" type="password" placeholder = "password"
                     />
                    <button onClick={handleLogin} className = "w-[200px] h-[50px] rounded-2xl m-5 bg-green-600 hover:bg-green-700 cursor-pointer">Login</button>
                </div>

            
            </div>

        </div>

    );
}
