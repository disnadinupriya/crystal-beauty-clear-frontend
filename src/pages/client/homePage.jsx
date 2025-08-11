import { Route, Routes } from "react-router-dom";
import Header from "../../components/header.jsx";
import ProductPage from "./productsPage.jsx";
import ProductOverView from "./productOverView.jsx"; // ✅ Capitalized import

export default function HomePage() {
  return (
    <div className="w-full h-screen max-h-screen bg-pink-200">
      <Header />
      <div className="w-full min-h-[calc(100vh-70px)] bg-gray-100">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:productid" element={<ProductOverView />} /> {/* ✅ Uppercase */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}
