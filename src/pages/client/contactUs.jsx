import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'; // Uncomment react-icons for visual appeal

function ContactUs() {
  // State for form inputs
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

  // Handle form submission (placeholder logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // 1. You would typically send this data to an API endpoint here.
   toast.success('Your message has been sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Tailwind CSS variables/placeholders:
  // Assuming a primary color of a deep green (e.g., green-700) and a light background.
  const primaryColor = 'bg-green-700 hover:bg-green-800';
  const inputStyle = 'w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Get in Touch with Our Team 🌿</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you have a query about an order, our ingredients, or our sustainability efforts, 
            we are here to help.
          </p>
        </header>

        {/* Contact Content Grid (Form and Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* 1. Contact Form */}
          <section className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <input 
                type="text" 
                name="name" 
                placeholder="Your Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                className={inputStyle}
                required 
              />
              
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                className={inputStyle}
                required 
              />
              
              <input 
                type="text" 
                name="subject" 
                placeholder="Subject" 
                value={formData.subject} 
                onChange={handleChange} 
                className={inputStyle}
                required 
              />
              
              <textarea 
                name="message" 
                placeholder="Your Message..." 
                rows="6" 
                value={formData.message} 
                onChange={handleChange} 
                className={inputStyle}
                required
              ></textarea>
              
              <button 
                type="submit" 
                className={`w-full text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ${primaryColor}`}
              >
                Send Message
              </button>
            </form>
          </section>

          {/* 2. Information Sidebar */}
          <aside className="bg-gray-100 p-8 rounded-xl shadow-lg h-fit">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaMapMarkerAlt className="text-green-700 w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Our Location</h4>
                  <p className="text-gray-600">Crystal Beauty Clear Headquarters</p>
                  <p className="text-sm text-gray-500">123 Crystal Blvd, Beauty Complex, Colombo, Sri Lanka</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FaEnvelope className="text-green-700 w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Customer Support</h4>
                  <p className="text-gray-600">Email: support@crystalbeauty.com</p>
                  <p className="text-sm text-gray-500">Press inquiries: press@crystalbeauty.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FaPhone className="text-green-700 w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Call Us</h4>
                  <p className="text-gray-600">Hotline: (+94) 11 789 0123</p>
                  <p className="text-sm text-gray-500">Mon - Fri: 9:00 AM - 5:00 PM (LKR)</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
        
        {/* 3. Map Placeholder */}
        <section className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Find Our Complex</h2>
            <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 italic">Map Placeholder: Embed your Google Maps iframe or component here.</p>
            </div>
        </section>
        
      </div>
    </div>
  );
}

export default ContactUs;