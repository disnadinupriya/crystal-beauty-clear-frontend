import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import ProductPage from "./productsPage.jsx";
import ProductOverView from "./productOverView.jsx";
import CartPage from "./cart.jsx";
import { toast } from "react-hot-toast";

// --- 1. The Banner/Hero Section ---
const HeroSection = () => (
  <section className="nbc-hero-section w-full">
    <div className="hero-overlay flex items-center justify-center h-[360px] bg-gradient-to-r from-green-400 to-emerald-300">
      <div className="text-center px-6">
        <h1 className="hero-title text-4xl md:text-5xl font-bold text-white">Sri Lanka's Greenest Cosmetics Manufacturer</h1>
        <h2 className="hero-subtitle text-xl md:text-2xl text-white/90 mt-2">Inspired by Nature, Powered by Science.</h2>
        <p className="hero-tagline text-white/90 mt-4 max-w-2xl mx-auto">Awarded, Certified, and Trusted by Generations for Sustainable Beauty.</p>
        <div className="mt-6">
          <Link to="/products" className="inline-block">
            <button className="cta-button primary bg-white text-green-700 px-6 py-2 rounded-full font-semibold shadow">Explore Our Products</button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// --- 2. Mission & Values (Sustainability Focus) ---
const MissionAndValues = () => (
  <section className="nbc-mission container mx-auto px-4 py-12">
    <div className="mission-content max-w-4xl mx-auto text-center">
      <h2 className="section-title text-2xl md:text-3xl font-semibold">Our Vision: The Most Environment-Friendly Cosmetics Manufacturer in the World.</h2>
      <p className="mission-text mt-4 text-gray-700">
        At Crystal Beauty Clear, our commitment goes beyond skin deep. We blend ancient herbal wisdom with
        advanced scientific research, driven by a deep Love & Respect for Nature.
      </p>
    </div>
    <div className="value-pillars mt-8 flex flex-wrap justify-center gap-4">
      <div className="value-card bg-white p-4 rounded shadow">🌿 Biodiversity Conservation</div>
      <div className="value-card bg-white p-4 rounded shadow">✨ NATRUE Certified Natural</div>
      <div className="value-card bg-white p-4 rounded shadow">🌱 Vegetarian & Cruelty-Free</div>
      <div className="value-card bg-white p-4 rounded shadow">🏆 National Green Award Winner</div>
    </div>
  </section>
);

// --- 3. Unique Complex & Research Showcase (The Medicinal Garden) ---
const ResearchShowcase = () => (
  <section className="nbc-research-showcase bg-emerald-50 py-12">
    <div className="showcase-content container mx-auto px-4 max-w-5xl text-center">
        <h2 className="section-title text-2xl md:text-3xl font-semibold text-emerald-800">A Sanctuary of Medicinal Plants</h2>
        <p className="showcase-description mt-3 text-gray-700">
            Our unique 13-acre manufacturing complex is home to Sri Lanka's largest privately owned
            Medicinal Plant Collection. We grow, conserve, and study over 800 plant species to ensure
            the purity and efficacy of every ingredient.
        </p>
        <div className="stats-bar mt-6 flex flex-wrap justify-center gap-6 text-sm text-emerald-800">
            <span><strong>13+ Acres</strong> of Garden</span>
            <span><strong>800+</strong> Plant Species</span>
            <span><strong>Advanced</strong> Plant Research Center</span>
        </div>
        <div className="mt-6">
          <button
            className="secondary-button bg-white text-emerald-700 px-4 py-2 rounded shadow"
            onClick={() => {
              // navigate to products page (could be specific garden/learn page if available)
              window.location.href = '/products';
            }}
          >
            Discover Our Botanical Sanctuary
          </button>
        </div>
    </div>
  </section>
);

// --- 4. Featured Product Brands (e.g., Nature's Secrets, Panda Baby) ---
const FeaturedBrands = () => (
    <section className="nbc-featured-brands container mx-auto px-4 py-12">
        <h2 className="section-title text-2xl md:text-3xl font-semibold">Explore Our Brands</h2>
        <p className="mt-2 text-gray-700">From Sri Lanka's No. 1 herbal beauty brand to the most trusted baby care range, find your perfect match.</p>
        <div className="brand-logos-grid mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link key="crystal" to={`/products?brand=CrystalSecrets`} className="block">
              <div className="brand-card bg-white p-6 rounded shadow hover:scale-105 transition">
                <h3 className="font-semibold">Crystal Secrets</h3>
                <p className="text-sm text-gray-600 mt-1">The core herbal beauty range.</p>
              </div>
            </Link>
            <Link key="clearbaby" to={`/products?brand=ClearBaby`} className="block">
              <div className="brand-card bg-white p-6 rounded shadow hover:scale-105 transition">
                <h3 className="font-semibold">Clear Baby</h3>
                <p className="text-sm text-gray-600 mt-1">Pediatrician-tested mildness.</p>
              </div>
            </Link>
            <Link key="elithe" to={`/products?brand=Elithe`} className="block">
              <div className="brand-card bg-white p-6 rounded shadow hover:scale-105 transition">
                <h3 className="font-semibold">Elithé Luxury</h3>
                <p className="text-sm text-gray-600 mt-1">High-performing Ayurveda.</p>
              </div>
            </Link>
        </div>
    </section>
);

function HomeIndex() {
  return (
    <main className="home-page-nbc-style">
      <HeroSection />
      <MissionAndValues />
      <ResearchShowcase />
      <FeaturedBrands />

      {/* 5. News and Newsletter CTA */}
      <section className="nbc-newsletter-cta container mx-auto px-4 py-10">
        <NewsletterCTA />
      </section>
    </main>
  );
}

function NewsletterCTA() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = (email || "").trim();
    if (!trimmed) return toast.error("Please enter your email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return toast.error("Please enter a valid email");

    try {
      const key = "subscribers";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(existing)) existing = [];
      if (existing.includes(trimmed)) {
        toast("You're already subscribed");
        setEmail("");
        return;
      }
      existing.push(trimmed);
      localStorage.setItem(key, JSON.stringify(existing));
      toast.success("Subscribed — thank you!");
      setEmail("");
    } catch (err) {
      console.error("Newsletter subscribe failed", err);
      toast.error("Failed to subscribe");
    }
  }

  return (
    <div className="newsletter-content max-w-2xl mx-auto text-center bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold">Join Our Family</h3>
      <p className="text-gray-700 mt-2">Sign up to receive new product updates, exclusive discounts, beauty tips & more.</p>
      <form className="newsletter-form mt-4 flex gap-2 justify-center" onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" required className="px-3 py-2 border rounded w-2/3" />
        <button type="submit" className="cta-button secondary bg-emerald-600 text-white px-4 py-2 rounded">Subscribe</button>
      </form>
    </div>
  );
}

export default function HomePage() {
  return (
    <Routes>
      <Route index element={<HomeIndex />} />
      <Route path="products" element={<ProductPage />} />
      <Route path="overview/:productid" element={<ProductOverView />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="*" element={<h1 className="p-8">404 Not Found</h1>} />
    </Routes>
  );
}

