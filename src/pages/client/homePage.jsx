import { Route, Routes } from "react-router-dom";
import Header from "../../components/header.jsx";

export default function HomePage() {
    return (
        <div className="w-full h-screen max-h-screen bg-pink-200">
            <Header />
            <div className="w-full h-[calc(100vh-70px)] bg-slate-400">
                <Routes>
                    <Route path="/" element={<h1>Home Page</h1>} />
                    <Route path="/products" element={<h1>Products Page</h1>} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </div>
        </div>
    );
}
