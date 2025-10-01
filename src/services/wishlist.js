// src/services/wishlist.js
const API_BASE_URL = process.env.REACT_APP_WISHLIST_API_URL;

export const getWishlist = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch wishlist");
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

export const addToWishlist = async (product) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        productCategory: product.category,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 409) {
        return { alreadyExists: true };
      }
      throw new Error(error.error || "Failed to add to wishlist");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to remove from wishlist");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};
