import React from "react";

// --- INTERNAL LEAF ICON SVG ---
// No external packages needed.
const LeafIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-emerald-600"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[200px] w-full gap-4">
      
      <div className="relative flex justify-center items-center">
        {/* Outer Static Ring (Light Green) */}
        <div className="absolute h-16 w-16 border-4 border-emerald-100 rounded-full"></div>
        
        {/* Inner Spinning Ring (Deep Emerald) */}
        <div className="absolute h-16 w-16 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Center Icon (Pulsing Nature Element) */}
        <div className="animate-pulse scale-75">
           <LeafIcon />
        </div>
      </div>

      {/* Premium Loading Text */}
      <p className="text-emerald-800 font-serif font-medium tracking-[0.2em] text-sm animate-pulse uppercase mt-2">
        Loading...
      </p>
    </div>
  );
}