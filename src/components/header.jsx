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
      {/* --- Fixed Header | Natural Premium Theme --- */}
      <header className="fixed top-0 left-0 w-full bg-[#064e3b] text-white shadow-xl z-50 border-b border-emerald-800/50 font-sans transition-all duration-300">
        <div className="flex justify-between items-center px-6 lg:px-10 h-[80px] max-w-7xl mx-auto">

          {/* Logo - Serif Font for Luxury/Natural Feel */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-emerald-50 hover:text-white transition-colors drop-shadow-md"
          >
            MyShop
          </Link>

          {/* Desktop Menu - Uppercase & Clean */}
          <nav className="hidden md:flex space-x-8 lg:space-x-10 text-sm font-medium uppercase tracking-[0.15em]">
            <Link 
              to="/" 
              className="text-emerald-100/90 hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-all duration-300"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-emerald-100/90 hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-all duration-300"
            >
              Products
            </Link>
            <Link 
              to="/myOders" 
              className="text-emerald-100/90 hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-all duration-300"
            >
              My Orders
            </Link>
            <Link 
              to="/contact" 
              className="text-emerald-100/90 hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-all duration-300"
            >
              Contact Us
            </Link>
            <Link 
              to="/reviews" 
              className="text-emerald-100/90 hover:text-white hover:underline underline-offset-8 decoration-emerald-400 transition-all duration-300"
            >
              Reviews
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-5 md:space-x-8">

            {/* User Status - Styled Container */}
            <div className="hidden md:flex items-center bg-emerald-900/50 px-4 py-1 rounded-full border border-emerald-800 text-sm text-emerald-100">
              <UserState />
            </div>

            {/* Profile Icon (Desktop) */}
            <Link
              to="/profile"
              className="hidden md:flex text-2xl text-emerald-200 hover:text-white hover:scale-110 transition-all duration-300"
            >
              <CgProfile />
            </Link>

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="text-2xl text-emerald-200 hover:text-white hover:scale-110 transition-all duration-300 relative"
            >
              <BsCart4 />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-3xl text-emerald-100 hover:text-white focus:outline-none transition-transform active:scale-90"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown - Smooth & Professional */}
        {menuOpen && (
          <nav className="md:hidden bg-[#064e3b] border-t border-emerald-800 shadow-2xl animate-in slide-in-from-top-5 duration-300">
            <Link 
              to="/" 
              className="block py-4 px-6 text-emerald-100 hover:bg-emerald-900 hover:text-white hover:pl-8 transition-all duration-300 border-b border-emerald-800/50 font-medium tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block py-4 px-6 text-emerald-100 hover:bg-emerald-900 hover:text-white hover:pl-8 transition-all duration-300 border-b border-emerald-800/50 font-medium tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/myOders" 
              className="block py-4 px-6 text-emerald-100 hover:bg-emerald-900 hover:text-white hover:pl-8 transition-all duration-300 border-b border-emerald-800/50 font-medium tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
            </Link>
            <Link 
              to="/contact" 
              className="block py-4 px-6 text-emerald-100 hover:bg-emerald-900 hover:text-white hover:pl-8 transition-all duration-300 border-b border-emerald-800/50 font-medium tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              to="/reviews" 
              className="block py-4 px-6 text-emerald-100 hover:bg-emerald-900 hover:text-white hover:pl-8 transition-all duration-300 border-b border-emerald-800/50 font-medium tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              Reviews
            </Link>

            {/* Mobile Profile */}
            <Link
              to="/userData"
              className="flex items-center gap-3 py-4 px-6 text-emerald-100 hover:bg-emerald-900 hover:text-white hover:pl-8 transition-all duration-300 border-b border-emerald-800/50 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <CgProfile className="text-xl" />
              <span>Profile</span>
            </Link>

            {/* UserState inside Mobile */}
            <div className="py-4 px-6 border-t border-emerald-800/50 bg-emerald-950/30 flex justify-center text-emerald-200">
              <UserState />
            </div>
          </nav>
        )}
      </header>

      {/* --- Push Content Down (Matches Header Height) --- */}
      <div className="h-[80px]"></div>
    </>
  );
}