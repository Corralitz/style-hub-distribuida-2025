// src/context/WishlistContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getWishlist,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  clearWishlist as clearWishlistAPI,
} from "../services/wishlist";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  // Fetch wishlist from API
  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getWishlist();
      setWishlist(items);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setError("Failed to load wishlist");
      // Don't crash the app, just log the error
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      setError(null);

      // Optimistic update - add to UI immediately
      const optimisticItem = {
        id: product.id,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        productCategory: product.category,
        addedAt: new Date().toISOString(),
      };

      setWishlist((prev) => [optimisticItem, ...prev]);

      // Make API call
      const addedItem = await addToWishlistAPI(product);

      // If the item already existed, the API returns alreadyExists: true
      if (addedItem.alreadyExists) {
        console.log("Item already in wishlist");
        return { success: true, alreadyExists: true };
      }

      // Reload to get the actual data from server
      await loadWishlist();

      return { success: true, item: addedItem };
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add to wishlist");

      // Rollback optimistic update on error
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== product.id),
      );

      return { success: false, error: err.message };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setError(null);

      // Optimistic update - remove from UI immediately
      const previousWishlist = [...wishlist];
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId),
      );

      // Make API call
      await removeFromWishlistAPI(productId);

      return { success: true };
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("Failed to remove from wishlist");

      // Rollback optimistic update on error
      setWishlist(previousWishlist);

      return { success: false, error: err.message };
    }
  };

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlist = async (product) => {
    const isInWishlist = wishlist.some((item) => item.productId === product.id);

    if (isInWishlist) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      setError(null);

      // Optimistic update
      const previousWishlist = [...wishlist];
      setWishlist([]);

      // Make API call
      await clearWishlistAPI();

      return { success: true };
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      setError("Failed to clear wishlist");

      // Rollback on error
      setWishlist(previousWishlist);

      return { success: false, error: err.message };
    }
  };

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: loadWishlist,
    wishlistCount: wishlist.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
