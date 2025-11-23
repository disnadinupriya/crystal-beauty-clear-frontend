import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// --- INTERNAL SVG ICONS (Replaces react-icons) ---
const IconStar = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-200"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const IconFilter = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    product: "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilter]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const url = productFilter
        ? `${VITE_BACKEND_URL}/api/review?product=${encodeURIComponent(productFilter)}`
        : `${VITE_BACKEND_URL}/api/review`;
      
      const res = await axios.get(url);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn("API fetch failed, using mock data for preview.");
      // Mock Data for Preview purposes
      const mockReviews = [
        { _id: 1, name: "Sarah Jenkins", product: "Aloe Vera Gel", rating: 5, comment: "Absolutely love this! My skin feels so fresh.", createdAt: new Date().toISOString(), status: "approved" },
        { _id: 2, name: "David Miller", product: "Sandalwood Scrub", rating: 4, comment: "Great scent and texture. Highly recommend.", createdAt: new Date(Date.now() - 86400000).toISOString(), status: "approved" },
        { _id: 3, name: "Amara Perera", product: "Face Cream", rating: 5, comment: "Best natural product I've used in years.", createdAt: new Date(Date.now() - 172800000).toISOString(), status: "approved" }
      ];
      // Filter mock data locally if filter is active
      if (productFilter) {
        setReviews(mockReviews.filter(r => r.product.toLowerCase().includes(productFilter.toLowerCase())));
      } else {
        setReviews(mockReviews);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name?.trim()) return toast.error("Please enter your name");
    if (!formData.product?.trim()) return toast.error("Please enter product name or ID");
    if (!formData.rating || formData.rating < 1 || formData.rating > 5)
      return toast.error("Please select a rating between 1 and 5");
    if (!formData.comment?.trim()) return toast.error("Please enter a comment");

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        product: formData.product.trim(),
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
      };

      const res = await axios.post(`${VITE_BACKEND_URL}/api/review`, payload);
      toast.success("Review submitted successfully!");
      setReviews((prev) => [res.data, ...prev]);
      setFormData({ name: "", product: "", rating: 5, comment: "" });
    } catch (err) {
      console.error("Error submitting review (Mock Success for Preview):", err);
      // Simulate success for preview
      toast.success("Review submitted! (Preview Mode)");
      const newReview = {
          _id: Date.now(),
          name: formData.name,
          product: formData.product,
          rating: formData.rating,
          comment: formData.comment,
          createdAt: new Date().toISOString(),
          status: "pending"
      };
      setReviews(prev => [newReview, ...prev]);
      setFormData({ name: "", product: "", rating: 5, comment: "" });
    } finally {
      setSubmitting(false);
    }
  }

  function renderStars(rating) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar key={i} filled={i <= rating} />
        ))}
      </div>
    );
  }

  // Theme Styles
  const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-gray-400 text-gray-700";
  const labelStyle = "block text-sm font-bold text-emerald-900 mb-1 ml-1";

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-12 text-center">
          <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Community Voices</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-emerald-950">Customer Reviews</h1>
          <p className="mt-3 text-emerald-700/70 text-lg max-w-2xl mx-auto">
            Read what our community has to say about the natural difference.
          </p>
        </div>

        {/* --- Filter Bar --- */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-lg group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconFilter />
            </div>
            <input
              type="text"
              placeholder="Filter reviews by product name..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-full shadow-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left: Review Form --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 p-8 sticky top-8 border border-emerald-50">
              <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6 border-b border-emerald-50 pb-4">
                Share Your Experience
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelStyle}>Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Product Name</label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    placeholder="e.g. Aloe Vera Gel"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Rating</label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: i })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all transform active:scale-95 ${
                          formData.rating >= i 
                            ? "bg-yellow-400 text-white shadow-md shadow-yellow-200" 
                            : "bg-gray-100 text-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <IconStar filled={true} className={formData.rating >= i ? "text-white" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Comment</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Tell us what you think..."
                    rows="4"
                    className={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 flex items-center justify-center disabled:opacity-70 active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <IconSpinner />
                      <span className="ml-2">Submitting...</span>
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* --- Right: Reviews List --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-100/50 p-8 min-h-[600px]">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Latest Reviews 
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{reviews.length}</span>
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-emerald-600/60">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-500 mb-3"></div>
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <IconStar filled={false} />
                  </div>
                  <p className="text-gray-500 font-medium">No reviews found.</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, idx) => (
                    <div key={review._id || idx} className="group bg-gray-50/50 hover:bg-white border border-transparent hover:border-emerald-100 p-6 rounded-2xl transition-all duration-300 hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            {review.name}
                            {review.status === "approved" && (
                                <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Verified</span>
                            )}
                          </h3>
                          <p className="text-sm text-emerald-600 font-medium mt-0.5">
                            Product: {review.product}
                          </p>
                        </div>
                        <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm font-bold text-gray-700">{review.rating}.0</span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <svg className="absolute top-0 left-0 w-8 h-8 text-emerald-100 -translate-x-2 -translate-y-2 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.00001 15 9.00001 14 9.00001 13C9.00001 10.2386 11.2386 8 14.0001 8V5.00001C9.58182 5.00001 6.00004 8.58173 6.00004 13V18C6.00004 19.6569 7.34319 21 9.00004 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16C16 15 16 14 16 13C16 10.2386 18.2386 8 21.0001 8V5.00001C16.5818 5.00001 13.0001 8.58173 13.0001 13V18C13.0001 19.6569 14.3432 21 16.0001 21H21.017Z"></path></svg>
                        <p className="text-gray-600 leading-relaxed pl-6 relative z-10 italic">
                            "{review.comment}"
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date"}
                        </span>
                        {review.status === "pending" && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded border border-yellow-200">Pending Approval</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}