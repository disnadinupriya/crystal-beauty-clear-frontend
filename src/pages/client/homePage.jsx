import { Route, Routes } from "react-router-dom";
import Header from "../../components/header.jsx";
import ProductPage from "./productsPage.jsx";
import ProductOverView from "./productOverView.jsx";



export default function HomePage() {
  return (
    <div className="w-full h-screen max-h-screen ">
      <Header />
      <div className="w-full h-[calc(100vh-70px)] min-h-[calc(100vh-70px)] bg-gray-100">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:productid" element={<ProductOverView />} />
          
          <Route path="*" element={<h1>404 Not Found</h1>} />

          
        </Routes>
      </div>
    </div>
  );
}
