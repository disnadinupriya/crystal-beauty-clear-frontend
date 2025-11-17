import React from 'react';

export default function FooterCorner() {
  function scrollToFooter() {
    const el = document.getElementById('site-footer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }

  return (
    <button
      aria-label="Go to footer"
      title="Go to footer"
      onClick={scrollToFooter}
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
}
