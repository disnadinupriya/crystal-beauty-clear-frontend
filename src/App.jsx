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
import Footer from "./components/footer.jsx";
import FooterCorner from "./components/footerCorner.jsx";
import ProfilePage from "./pages/client/profilePage.jsx";
import ReviewsPage from "./pages/client/reviewsPage.jsx";




function AppContent() {
  const location = useLocation();

  // Routes where header should be hidde n
  const hideHeaderRoutes = ["/login", "/register","/forgetPassword"];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />

      {!hideHeader && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkOut" element={<CheckOutPage />} />
          <Route path="/res" element={<TestingResponse />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      
      <Footer />
      <FooterCorner />
    </div>
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
