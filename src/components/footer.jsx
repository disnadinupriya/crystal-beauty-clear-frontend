import React from "react";
import { Link } from "react-router-dom";

// --- INTERNAL SVG ICONS ---
const IconFacebook = () => (
  <svg fill="currentColor" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
  </svg>
);

const IconInstagram = () => (
  <svg fill="currentColor" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
  </svg>
);

const IconLinkedin = () => (
  <svg fill="currentColor" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
  </svg>
);

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer id="site-footer" className="bg-[#022c22] text-emerald-100/80 font-sans border-t border-emerald-800/50">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 1. Brand Section (Full width on Mobile) */}
        <div className="space-y-3 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">Crystal Beauty Clear</h3>
          <p className="text-xs md:text-sm text-emerald-200/70 leading-relaxed max-w-sm mx-auto md:mx-0">
            Sustainable Beauty, Inspired by Nature. Pure ingredients for a pure soul.
          </p>
          <div className="flex items-center justify-center md:justify-start space-x-3 pt-1">
            <a href="#" className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-800 flex items-center justify-center text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all">
              <IconFacebook />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-800 flex items-center justify-center text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all">
              <IconInstagram />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-800 flex items-center justify-center text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all">
              <IconLinkedin />
            </a>
          </div>
        </div>

        {/* --- Mobile Only: Grid Layout for Links --- */}
        {/* This wrapper makes Quick Links & Customer Care appear side-by-side on mobile */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 md:gap-10">
            
            {/* 2. Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-sm md:text-lg font-semibold text-white uppercase tracking-wider mb-3 border-b border-emerald-800/50 pb-1 inline-block">Quick Links</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                <li><Link to="/" className="hover:text-white block py-0.5">Home</Link></li>
                <li><Link to="/products" className="hover:text-white block py-0.5">Products</Link></li>
                <li><Link to="/reviews" className="hover:text-white block py-0.5">Reviews</Link></li>
                <li><Link to="/blog" className="hover:text-white block py-0.5">Blog / Tips</Link></li>
              </ul>
            </div>

            {/* 3. Customer Care */}
            <div className="text-center md:text-left">
              <h4 className="text-sm md:text-lg font-semibold text-white uppercase tracking-wider mb-3 border-b border-emerald-800/50 pb-1 inline-block">Care</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                <li><Link to="/contact" className="hover:text-white block py-0.5">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-white block py-0.5">Shipping</Link></li>
                <li><Link to="/faq" className="hover:text-white block py-0.5">FAQ</Link></li>
                <li><Link to="/privacy" className="hover:text-white block py-0.5">Privacy Policy</Link></li>
              </ul>
            </div>
        </div>

        {/* 4. Contact Info (Full width on Mobile) */}
        <div className="text-center md:text-left">
          <h4 className="text-sm md:text-lg font-semibold text-white uppercase tracking-wider mb-3 border-b border-emerald-800/50 pb-1 inline-block">Get in Touch</h4>
          <address className="not-italic text-xs md:text-sm space-y-2">
            <p className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3">
              <span className="text-emerald-400">📍</span>
              <span>123 Crystal Blvd<br />Beauty Complex, Colombo</span>
            </p>
            <p className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <span className="text-emerald-400">✉️</span>
              <a className="hover:text-white" href="mailto:info@crystalbeauty.com">info@crystalbeauty.com</a>
            </p>
            <p className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <span className="text-emerald-400">📞</span>
              <a className="hover:text-white" href="tel:+9411xxxxxxx">(+94) 11 XXX XXXX</a>
            </p>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#02241c] border-t border-emerald-900/50 text-emerald-300/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] md:text-xs gap-3 text-center">
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
            <span className="flex items-center gap-1"><span className="text-yellow-500">★</span> National Green Award Gold</span>
            <span className="hidden md:inline text-emerald-800">•</span>
            <span className="flex items-center gap-1"><span className="text-green-500">✔</span> NATRUE Certified</span>
            <span className="hidden md:inline text-emerald-800">•</span>
            <span className="flex items-center gap-1"><span className="text-pink-400">♥</span> Cruelty-Free</span>
          </div>

          <div className="md:text-right">
            &copy; {currentYear} Crystal Beauty Clear
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;