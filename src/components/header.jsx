import React from "react";
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
          <nav className="md:hidden bg-blue-600">
            <Link to="/" className="block py-2 px-4 hover:bg-blue-700">Home</Link>
            <Link to="/products" className="block py-2 px-4 hover:bg-blue-700">Products</Link>
            <Link to="/contact" className="block py-2 px-4 hover:bg-blue-700">Contact Us</Link>
            <Link to="/reviews" className="block py-2 px-4 hover:bg-blue-700">Reviews</Link>
            <Link to="/userData" className="block py-2 px-4 hover:bg-blue-700">Profile</Link>
          </nav>
        )}
      </header>

      {/* --- Push Content Dow n --- */}
      <div className="h-[70px] md:h-[80px]"></div>
    </>
  );
}
