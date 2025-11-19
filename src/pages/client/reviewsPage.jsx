import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";

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

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilter]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const url = productFilter
        ? `${backendUrl}/api/review?product=${encodeURIComponent(productFilter)}`
        : `${backendUrl}/api/review`;
      const res = await axios.get(url);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
      setReviews([]);
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

      const res = await axios.post(`${backendUrl}/api/review`, payload);
      toast.success("Review submitted successfully!");
      setReviews((prev) => [res.data, ...prev]);
      setFormData({ name: "", product: "", rating: 5, comment: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
      const msg = err.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function renderStars(rating) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <FaStar
            key={i}
            className={i <= rating ? "text-yellow-400" : "text-gray-300"}
            size={16}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="mt-2 text-gray-600">Share your experience with our products</p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Filter by product name or ID..."
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name / ID</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="Enter product name or ID"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i })}
                    className={`w-10 h-10 rounded flex items-center justify-center transition ${
                      formData.rating >= i ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience..."
                rows="5"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={review._id || idx} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{review.name}</h3>
                      <p className="text-sm text-gray-500">Product: <strong>{review.product}</strong></p>
                    </div>
                    <div className="text-right">{renderStars(review.rating)}</div>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                  <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                    <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                    {review.status && (
                      <span className={`px-2 py-1 rounded ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : review.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>{review.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
