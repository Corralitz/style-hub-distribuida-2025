// src/services/comments.js
// Service for interacting with the comments API

const API_BASE_URL = process.env.REACT_APP_COMMENTS_API_URL;

/**
 * Add a new comment to a product
 * @param {Object} commentData - The comment data
 * @param {string} commentData.productId - Contentful Entry ID
 * @param {string} commentData.author - Comment author name
 * @param {string} commentData.email - Author email (optional)
 * @param {string} commentData.comment - Comment text
 * @param {number} commentData.rating - Rating 1-5 (optional)
 * @returns {Promise<Object>} - Created comment
 */
export const addComment = async (commentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

/**
 * Get all comments for a specific product
 * @param {string} productId - Contentful Entry ID
 * @returns {Promise<Array>} - Array of comments
 */
export const getCommentsByProduct = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comments?productId=${encodeURIComponent(productId)}`,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch comments");
    }

    const data = await response.json();
    return data.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

/**
 * Get comment statistics for a product
 * @param {Array} comments - Array of comments
 * @returns {Object} - Statistics including average rating and count
 */
export const getCommentStats = (comments) => {
  if (!comments || comments.length === 0) {
    return {
      totalComments: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const ratingsOnly = comments.filter((c) => c.rating).map((c) => c.rating);
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  ratingsOnly.forEach((rating) => {
    ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
  });

  const averageRating =
    ratingsOnly.length > 0
      ? ratingsOnly.reduce((sum, rating) => sum + rating, 0) /
        ratingsOnly.length
      : 0;

  return {
    totalComments: comments.length,
    totalRatings: ratingsOnly.length,
    averageRating: parseFloat(averageRating.toFixed(1)),
    ratingDistribution,
  };
};
