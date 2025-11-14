import { useState } from "react";
import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import UserState from "./userData.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* --- Fixed Header --- */}
      <header className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-md z-50">
        <div className="flex justify-between items-center px-6 h-[70px]">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide hover:text-gray-200">
            MyShop
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 text-lg font-medium">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/products" className="hover:text-gray-200">Products</Link>
            <Link to="/contact" className="hover:text-gray-200">Contact Us</Link>
            <Link to="/reviews" className="hover:text-gray-200">Reviews</Link>
            <Link to="/userData" className="hover:text-gray-200">Profile</Link>
            
          </nav>

          {/* Cart + Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="absolute right-[80px] h-full  flex items-center">
              <UserState />
            </div>
            <Link to="/cart" className="text-3xl hover:text-gray-200 transition">
              <BsCart4 />
            </Link>
            <button
              className="md:hidden text-3xl focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-blue-600 w-full flex flex-col items-center space-y-4 py-4 text-lg font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Products</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Contact Us</Link>
            <Link to="/reviews" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Reviews</Link>
            <Link to="/userData" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Profile</Link>
            <div className="w-full flex justify-center">
              <UserState />
            </div>
          </div>
        )}
      </header>

      {/* --- Push Content Down --- */}
      <div className="h-[70px] md:h-[80px]"></div>
    </>
  );
}
