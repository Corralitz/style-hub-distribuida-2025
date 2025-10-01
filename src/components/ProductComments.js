// src/components/ProductComments.js
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  addComment,
  getCommentsByProduct,
  getCommentStats,
} from "../services/comments";

const ProductComments = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    comment: "",
    rating: 0,
  });

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByProduct(productId);
      setComments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load comments");
      setComments([]); // Set to empty array on error
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.author || !formData.comment) {
      setError("Name and comment are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await addComment({
        productId,
        ...formData,
      });

      setSuccess(true);
      setFormData({ author: "", email: "", comment: "", rating: 0 });

      // Reload comments
      await loadComments();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const stats = getCommentStats(comments);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const StarRating = ({
    rating,
    interactive = false,
    onRatingClick = null,
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && onRatingClick && onRatingClick(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Summary Stats */}
      {stats.totalRatings > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.averageRating}</div>
              <StarRating rating={Math.round(stats.averageRating)} />
              <div className="text-sm text-gray-600 mt-1">
                {stats.totalRatings} ratings
              </div>
            </div>
            <div className="flex-1 ml-6">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalRatings > 0
                            ? (stats.ratingDistribution[rating] /
                                stats.totalRatings) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {stats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Comment submitted successfully!
          </div>
        )}

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Rating (Optional)
            </label>
            <StarRating
              rating={formData.rating}
              interactive={true}
              onRatingClick={handleRatingClick}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Your Review *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          All Reviews ({comments.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{comment.author}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                  {comment.rating && <StarRating rating={comment.rating} />}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComments;
