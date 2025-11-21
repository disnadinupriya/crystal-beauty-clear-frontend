import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// --- INTERNAL SVG ICONS (Premium Quality) ---
const IconLeaf = () => (
  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
);
const IconStar = () => (
  <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
);
const IconHeart = () => (
  <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
);
const IconTrophy = () => (
  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

// --- 1. HERO SECTION (With Green Hills Background) ---
const HeroSection = () => (
  <section className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://tse3.mm.bing.net/th/id/OIP.f5a8jU9Q-QI42oXf0Tka8AHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3" 
        alt="Beautiful Green Hills" 
        className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
      />
      {/* Premium Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-emerald-950/90"></div>
      <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply"></div>
    </div>
    
    {/* Hero Content */}
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
      {/* Badge */}
      <div className="inline-block px-6 py-2 mb-8 border border-white/30 rounded-full bg-white/10 backdrop-blur-md shadow-lg animate-fade-in-down">
        <span className="text-white tracking-[0.3em] text-xs md:text-sm font-bold uppercase">Pure. Organic. Ethical.</span>
      </div>
      
      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-2xl animate-fade-in-up">
        Nature's Purest <br />
        <span className="italic text-emerald-200 relative inline-block">
          Embrace
          {/* Decorative Underline */}
          <svg className="absolute -bottom-2 left-0 w-full h-4 text-emerald-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="3" fill="none" /></svg>
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-emerald-50/90 text-lg md:text-2xl font-light max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg animate-fade-in-up delay-100">
        Sri Lanka's greenest cosmetics manufacturer. <br className="hidden md:block" />
        Where ancient herbal wisdom meets modern sustainable science.
      </p>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up delay-200">
        {/* NOTE: These Links will now work because they are inside the BrowserRouter in App.jsx */}
        <Link to="/products" className="group relative px-10 py-4 bg-white text-emerald-900 font-bold rounded-full overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]">
          <span className="relative z-10 flex items-center text-lg">
            Shop Collection 
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </span>
        </Link>
        <Link to="/contact" className="px-10 py-4 bg-white/10 border border-white/40 text-white font-semibold rounded-full hover:bg-white/20 backdrop-blur-md transition-all hover:border-white text-lg">
          Our Story
        </Link>
      </div>
    </div>
  </section>
);

// --- 2. MISSION & VALUES (Clean White Section) ---
const MissionAndValues = () => (
  <section className="py-24 bg-white relative">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Philosophy</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950 mb-6">
          Beyond Skin Deep
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          We don't just craft cosmetics; we cultivate a lifestyle that honors the Earth. 
          Blending <span className="text-emerald-700 font-semibold">ancient herbal wisdom</span> with cutting-edge science 
          for a truly sustainable future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <IconLeaf />, title: "Eco-Friendly", desc: "Biodiversity conservation at our core.", color: "border-green-100 bg-green-50/50" },
          { icon: <IconStar />, title: "Certified", desc: "NATRUE international standards.", color: "border-yellow-100 bg-yellow-50/50" },
          { icon: <IconHeart />, title: "Cruelty-Free", desc: "100% Vegetarian & Ethical.", color: "border-pink-100 bg-pink-50/50" },
          { icon: <IconTrophy />, title: "Awarded", desc: "National Green Award Gold Winner.", color: "border-orange-100 bg-orange-50/50" },
        ].map((item, idx) => (
          <div key={idx} className={`p-8 rounded-[2rem] border ${item.color} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-default`}>
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 bg-white p-4 w-20 h-20 rounded-full flex items-center justify-center shadow-sm mx-auto lg:mx-0">
                {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center lg:text-left">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed text-center lg:text-left">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- 3. RESEARCH SHOWCASE (Parallax Effect) ---
const ResearchShowcase = () => (
  <section className="relative py-32 overflow-hidden">
    {/* Parallax Background */}
    <div className="absolute inset-0 z-0">
        <img 
            src="https://img.freepik.com/premium-photo/mockup-plastic-packaging-bottles-with-natural-organic-cosmetics-bathroom_231813-998.jpg?w=2000" 
            alt="Medicinal Garden" 
            className="w-full h-full object-cover filter brightness-[0.35]"
        />
    </div>

    <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
                <div>
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-2 block">The Sanctuary</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                        Sri Lanka's Largest <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Medicinal Garden</span>
                    </h2>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-emerald-500 pl-6">
                    Nestled within our 13-acre complex lies a living library of nature. We grow, study, and protect over 800 plant species, ensuring that every drop in our products comes from a source of purity and vitality.
                </p>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                        <div className="text-3xl font-bold text-emerald-400">13+</div>
                        <div className="text-xs text-gray-400 uppercase mt-1">Acres</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                        <div className="text-3xl font-bold text-emerald-400">800+</div>
                        <div className="text-xs text-gray-400 uppercase mt-1">Species</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                        <div className="text-3xl font-bold text-emerald-400">100%</div>
                        <div className="text-xs text-gray-400 uppercase mt-1">Natural</div>
                    </div>
                </div>

                <Link to="/products" className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/30 hover:translate-x-2">
                    Explore Ingredients
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>
            
            {/* Floating Image Composition */}
            <div className="relative hidden lg:block">
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 transform rotate-2 hover:rotate-0 transition-all duration-700 group">
                    <img 
                        src="https://thumbs.dreamstime.com/z/green-leafy-natural-skincare-product-bottle-surrounded-lush-greenery-ferns-fresh-eco-friendly-setting-green-leafy-318867642.jpg?w=576" 
                        alt="Laboratory Research" 
                        className="w-full h-[600px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-white font-serif italic text-2xl">"Where ancient wisdom meets modern science."</p>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-full h-full border-2 border-emerald-500/30 rounded-[2.5rem] z-0"></div>
            </div>
        </div>
    </div>
  </section>
);

// --- 4. FEATURED BRANDS ---
const FeaturedBrands = () => (
  <section className="py-24 bg-emerald-50/50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950 mb-4">Our Premium Collections</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Curated ranges for every skin type and lifestyle.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: 'crystal', name: 'Crystal Secrets', desc: 'The flagship herbal beauty range.', gradient: 'from-green-100 to-emerald-200', text: 'text-emerald-900', btn: 'bg-emerald-600' },
          { id: 'clearbaby', name: 'Clear Baby', desc: 'Purest care for delicate skin.', gradient: 'from-blue-100 to-cyan-200', text: 'text-cyan-900', btn: 'bg-cyan-600' },
          { id: 'elithe', name: 'Elithé Luxury', desc: 'High-performing Ayurvedic luxury.', gradient: 'from-purple-100 to-fuchsia-200', text: 'text-purple-900', btn: 'bg-purple-600' }
        ].map((brand) => (
          <Link key={brand.id} to={`/products?brand=${brand.name.replace(' ', '')}`} className="group block h-full">
            <div className={`h-full p-10 rounded-[2.5rem] bg-gradient-to-br ${brand.gradient} hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden flex flex-col`}>
              
              <div className="relative z-10 flex-grow">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm text-2xl font-serif font-bold text-gray-800 group-hover:rotate-12 transition-transform duration-500">
                    {brand.name.charAt(0)}
                </div>
                <h3 className={`text-2xl font-serif font-bold mb-3 ${brand.text}`}>{brand.name}</h3>
                <p className="text-gray-700 font-medium leading-relaxed">{brand.desc}</p>
              </div>

              <div className="relative z-10 mt-8">
                <span className={`inline-flex items-center justify-center px-6 py-3 bg-white rounded-full text-sm font-bold text-gray-800 shadow-sm group-hover:bg-gray-900 group-hover:text-white transition-all duration-300`}>
                    Shop Now <span className="ml-2">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// --- 5. NEWSLETTER ---
function NewsletterCTA() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");
    toast.success("Welcome to the family! You are subscribed.");
    setEmail("");
  }

  return (
    <div className="relative bg-[#022c22] rounded-[3rem] overflow-hidden shadow-2xl mx-4 md:mx-0">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
         <img src="https://images.unsplash.com/photo-1500468776721-52f722972ccd?q=80&w=2128&auto=format&fit=crop" alt="Leaves" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 px-8 py-16 md:p-20 text-center">
        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Unlock Nature's Secrets</h3>
        <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto">
            Join our community to receive exclusive wellness tips, new product alerts, and green beauty insights directly to your inbox.
        </p>
        
        <form className="max-w-lg mx-auto relative flex flex-col sm:flex-row gap-4 sm:gap-0" onSubmit={handleSubmit}>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="Your email address..." 
            required 
            className="w-full pl-8 pr-8 sm:pr-40 py-5 rounded-full border-none bg-white/10 backdrop-blur-md text-white placeholder-emerald-200/50 focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 outline-none transition-all" 
          />
          <button type="submit" className="sm:absolute sm:right-2 sm:top-2 sm:bottom-2 px-8 py-3 sm:py-0 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-colors shadow-lg">
            Join
          </button>
        </form>
        <p className="text-emerald-500/60 text-xs mt-4">No spam, just pure beauty.</p>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT (No router wrapper, as App.js handles it) ---
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white selection:bg-emerald-200 selection:text-emerald-900">
      <HeroSection />
      <MissionAndValues />
      <ResearchShowcase />
      <FeaturedBrands />
      <section className="container mx-auto py-20">
        <NewsletterCTA />
      </section>
    </main>
  );
}