import React, { useState } from 'react';
import toast from 'react-hot-toast';

// --- INTERNAL SVG ICONS (Replaces react-icons for stability) ---
const IconMap = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);
const IconPhone = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
);
const IconMail = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const IconSend = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
);

function ContactUs() {
  // State for form inputs (Logic Unchanged)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // 1. You would typically send this data to an API endpoint here.
    toast.success('Your message has been sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Theme Styles
  const inputStyle = 'w-full p-4 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-300 shadow-sm text-gray-700 placeholder-gray-400';

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block animate-fade-in-down">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950 mb-6">
            We'd Love to Hear from You 🌿
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you have a query about an order, our ingredients, or our sustainability efforts, 
            we are here to help you on your natural journey.
          </p>
        </header>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* 1. Contact Form */}
          <section className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-50">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 ml-1">Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="e.g. Jane Doe" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className={inputStyle}
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900 ml-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="jane@example.com" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className={inputStyle}
                        required 
                    />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-900 ml-1">Subject</label>
                <input 
                    type="text" 
                    name="subject" 
                    placeholder="How can we help?" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    className={inputStyle}
                    required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-900 ml-1">Message</label>
                <textarea 
                    name="message" 
                    placeholder="Tell us more about your inquiry..." 
                    rows="6" 
                    value={formData.message} 
                    onChange={handleChange} 
                    className={inputStyle}
                    required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full md:w-auto md:px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
              >
                <IconSend />
                Send Message
              </button>
            </form>
          </section>

          {/* 2. Information Sidebar */}
          <aside className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h2 className="text-2xl font-serif font-bold mb-8 relative z-10">Contact Information</h2>
                
                <div className="space-y-8 relative z-10">
                    <div className="flex items-start space-x-4">
                        <div className="bg-emerald-800 p-3 rounded-full text-emerald-200">
                            <IconMap />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-emerald-100">Our Location</h4>
                            <p className="text-emerald-200/80 text-sm mt-1 leading-relaxed">
                                123 Crystal Blvd, <br/>Beauty Complex,<br/>Colombo, Sri Lanka
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="bg-emerald-800 p-3 rounded-full text-emerald-200">
                            <IconMail />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-emerald-100">Email Us</h4>
                            <p className="text-emerald-200/80 text-sm mt-1">support@crystalbeauty.com</p>
                            <p className="text-emerald-200/60 text-xs mt-1">press@crystalbeauty.com</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="bg-emerald-800 p-3 rounded-full text-emerald-200">
                            <IconPhone />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-emerald-100">Call Us</h4>
                            <p className="text-emerald-200/80 text-sm mt-1">(+94) 11 789 0123</p>
                            <p className="text-emerald-200/60 text-xs mt-1">Mon - Fri: 9:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Map Placeholder */}
            <div className="bg-white p-4 rounded-[2rem] shadow-lg border border-emerald-50">
                <div className="h-64 w-full rounded-[1.5rem] overflow-hidden bg-gray-100 relative group cursor-pointer">
                    <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop" 
                        alt="Map Preview" 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-emerald-900 shadow-lg flex items-center gap-2">
                            <IconMap />
                            View on Google Maps
                        </div>
                    </div>
                </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default ContactUs;