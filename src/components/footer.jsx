import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer id="site-footer" className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold">Crystal Beauty Clear</h3>
          <p className="mt-2 text-sm text-gray-300">Sustainable Beauty, Inspired by Nature.</p>
          <div className="mt-4 flex items-center space-x-3">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
            </li>
            <li>
              <Link to="/sustainability" className="text-gray-300 hover:text-white">Our Commitment</Link>
            </li>
            <li>
              <Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link>
            </li>
            <li>
              <Link to="/blog" className="text-gray-300 hover:text-white">Blog / Tips</Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold">Customer Care</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
            </li>
            <li>
              <Link to="/shipping" className="text-gray-300 hover:text-white">Shipping & Returns</Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold">Get in Touch</h4>
          <address className="not-italic mt-3 text-sm text-gray-300">
            123 Crystal Blvd<br />
            Beauty Complex, Colombo, Sri Lanka
            <div className="mt-2">Email: <a className="text-gray-200 hover:underline" href="mailto:info@crystalbeauty.com">info@crystalbeauty.com</a></div>
            <div>Phone: <a className="text-gray-200" href="tel:+9411xxxxxxx">(+94) 11 XXX XXXX</a></div>
          </address>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-sm gap-3">
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <span className="font-semibold">Awarded:</span>
            <span>National Green Award Gold</span>
            <span className="mx-2">•</span>
            <span className="font-semibold">Certified:</span>
            <span>NATRUE Natural Cosmetics</span>
            <span className="mx-2">•</span>
            <span>Vegetarian & Cruelty-Free</span>
          </div>

          <div className="text-center md:text-right">&copy; {currentYear} Crystal Beauty Clear | A Division of Nature's Beauty Creations Ltd. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;