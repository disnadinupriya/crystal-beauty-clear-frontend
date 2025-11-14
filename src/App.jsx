import LoginPage from "./pages/loginpage";
import AdminPage from "./pages/adminPage";
import Testing from "./pages/testing";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/client/register";
import HomePage from "./pages/client/homePage";
import CheckOutPage from "./pages/client/checkOut.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TestingResponse from "./pages/client/test.jsx";
import Header from "./components/header.jsx";
import ForgetPassword from "./pages/client/forgetPassword.jsx";



function AppContent() {
  const location = useLocation();

  // Routes where header should be hidden
  const hideHeaderRoutes = ["/login", "/register","/forgetPassword"];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" />

      {!hideHeader && <Header />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
  <Route path="/*" element={<HomePage />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkOut" element={<CheckOutPage />} />
        <Route path="/res" element={<TestingResponse />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId="427147346815-85snsi8rq5kpt5ovqqrc2atbruib1jhr.apps.googleusercontent.com">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
