import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import UserState from "./userData.jsx";



export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* --- Fixed Header --- */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-lg z-50">
        <div className="flex justify-between items-center px-6 h-[75px]">

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-wide hover:text-gray-200 transition"
          >
            MyShop
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 text-lg font-medium">
            <Link to="/" className="hover:text-gray-200 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-gray-200 transition">
              Products
            </Link>
            <Link to="/myOders" className="hover:text-gray-200 transition">
              My Orders
            </Link>
            <Link to="/contact" className="hover:text-gray-200 transition">
              Contact Us
            </Link>
            <Link to="/reviews" className="hover:text-gray-200 transition">
              Reviews
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6 relative">

            {/* User Status */}
            <div className="hidden md:flex items-center">
              <UserState />
            </div>

            {/* Profile Icon (Desktop) */}
            <Link
              to="/profile"
              className="hidden md:flex text-3xl hover:text-gray-200 transition"
            >
              <CgProfile />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="text-3xl hover:text-gray-200 transition">
              <BsCart4 />
            </Link>

            {/* Mobile Menu Toggle */}
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
          <nav className="md:hidden bg-blue-700 text-white shadow-lg">
            <Link to="/" className="block py-3 px-4 hover:bg-blue-800">
              Home
            </Link>
            <Link to="/products" className="block py-3 px-4 hover:bg-blue-800">
              Products
            </Link>
            <Link to="/myOders" className="block py-3 px-4 hover:bg-blue-800">
              My Orders
            </Link>
            <Link to="/contact" className="block py-3 px-4 hover:bg-blue-800">
              Contact Us
            </Link>
            <Link to="/reviews" className="block py-3 px-4 hover:bg-blue-800">
              Reviews
            </Link>

            {/* Mobile Profile */}
            <Link
              to="/userData"
              className="flex items-center gap-2 py-3 px-4 hover:bg-blue-800 text-xl"
            >
              <CgProfile />
              <span>Profile</span>
            </Link>

            {/* UserState inside Mobile */}
            <div className="py-3 px-4 border-t border-blue-600">
              <UserState />
            </div>
          </nav>
        )}
      </header>

      {/* --- Push Content Down --- */}
      <div className="h-[75px] md:h-[85px]"></div>
    </>
  );
}
