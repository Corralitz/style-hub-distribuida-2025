import { createClient } from "contentful";

// Initialize Contentful client
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || "master",
});

// Helper function to transform Contentful image URLs
const transformImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400";
  // Ensure the URL starts with https://
  const imageUrl = url.startsWith("//") ? `https:${url}` : url;
  // Add query parameters for optimization
  return `${imageUrl}?w=400&h=400&fit=crop`;
};

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await client.getEntries({
      content_type: "product",
      include: 2, // Include linked assets
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      category: item.fields.category?.toLowerCase() || "uncategorized",
      description: item.fields.description || "",
      image: item.fields.image?.fields?.file?.url
        ? transformImageUrl(item.fields.image.fields.file.url)
        : "https://via.placeholder.com/400",
      rating: item.fields.rating || 4.0,
      reviews: item.fields.reviews || 0,
      sizes: item.fields.sizes || ["M", "L"],
      colors: item.fields.colors || ["Black"],
      inStock: item.fields.inStock !== false,
      featured: item.fields.featured || false,
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const entry = await client.getEntry(id);

    return {
      id: entry.sys.id,
      name: entry.fields.name,
      price: entry.fields.price,
      category: entry.fields.category?.toLowerCase() || "uncategorized",
      description: entry.fields.description || "",
      image: entry.fields.image?.fields?.file?.url
        ? transformImageUrl(entry.fields.image.fields.file.url)
        : "https://via.placeholder.com/400",
      rating: entry.fields.rating || 4.0,
      reviews: entry.fields.reviews || 0,
      sizes: entry.fields.sizes || ["M", "L"],
      colors: entry.fields.colors || ["Black"],
      inStock: entry.fields.inStock !== false,
      featured: entry.fields.featured || false,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await client.getEntries({
      content_type: "category",
      include: 2,
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug,
      description: item.fields.description || "",
      image: item.fields.image?.fields?.file?.url
        ? transformImageUrl(item.fields.image.fields.file.url)
        : null,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch all orders
export const getOrders = async () => {
  try {
    const response = await client.getEntries({
      content_type: "order",
      include: 3, // Include nested references
    });

    return response.items.map((item) => ({
      id: item.fields.orderId || item.sys.id,
      orderId: item.fields.orderId,
      date: item.fields.date || item.sys.createdAt,
      status: item.fields.status || "Processing",
      total: item.fields.total || 0,
      products:
        item.fields.products?.map((product) => ({
          id: product.sys.id,
          name: product.fields.name,
          price: product.fields.price,
          quantity: 1, // You might want to add quantity field to your content model
        })) || [],
      user: item.fields.user
        ? {
            id: item.fields.user.sys.id,
            name: item.fields.user.fields.name,
            email: item.fields.user.fields.email,
          }
        : null,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Fetch user by ID
export const getUserById = async (id) => {
  try {
    const entry = await client.getEntry(id);

    return {
      id: entry.sys.id,
      name: entry.fields.name,
      email: entry.fields.email || "",
      bio: entry.fields.bio || "",
      avatar: entry.fields.avatar?.fields?.file?.url
        ? transformImageUrl(entry.fields.avatar.fields.file.url)
        : null,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Fetch featured products
export const getFeaturedProducts = async () => {
  try {
    const response = await client.getEntries({
      content_type: "product",
      "fields.featured": true,
      include: 2,
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      category: item.fields.category?.toLowerCase() || "uncategorized",
      description: item.fields.description || "",
      image: item.fields.image?.fields?.file?.url
        ? transformImageUrl(item.fields.image.fields.file.url)
        : "https://via.placeholder.com/400",
      rating: item.fields.rating || 4.0,
      reviews: item.fields.reviews || 0,
      sizes: item.fields.sizes || ["M", "L"],
      colors: item.fields.colors || ["Black"],
      inStock: item.fields.inStock !== false,
      featured: true,
    }));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// Search products by query
export const searchProducts = async (query) => {
  try {
    const response = await client.getEntries({
      content_type: "product",
      query: query,
      include: 2,
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      category: item.fields.category?.toLowerCase() || "uncategorized",
      description: item.fields.description || "",
      image: item.fields.image?.fields?.file?.url
        ? transformImageUrl(item.fields.image.fields.file.url)
        : "https://via.placeholder.com/400",
      rating: item.fields.rating || 4.0,
      reviews: item.fields.reviews || 0,
      sizes: item.fields.sizes || ["M", "L"],
      colors: item.fields.colors || ["Black"],
      inStock: item.fields.inStock !== false,
      featured: item.fields.featured || false,
    }));
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const getFooterColumns = async () => {
  try {
    const response = await client.getEntries({
      content_type: "footerColumn",
      order: "fields.order", // Sort by order field
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      order: item.fields.order || 0,
      links: item.fields.links || [],
    }));
  } catch (error) {
    console.error("Error fetching footer columns:", error);
    return [];
  }
};

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

    // Ensure we always return an array
    return Array.isArray(data.comments) ? data.comments : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
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
