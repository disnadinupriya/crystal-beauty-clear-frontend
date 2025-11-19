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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
     
      </div>

  );
}
