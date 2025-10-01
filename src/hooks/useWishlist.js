import { useState, useEffect, useCallback } from "react";
import {
  getWishlist as getWishlistAPI,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
} from "../services/wishlist";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from API on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await getWishlistAPI();

      // Transform API response to match your existing format
      const transformedItems = items.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        image: item.productImage,
        category: item.productCategory,
        // Add default values for fields your components might expect
        inStock: true,
        rating: 0,
        reviews: 0,
        sizes: ["M", "L"],
        colors: ["Black"],
      }));

      setWishlist(transformedItems);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = useCallback(
    async (product) => {
      const isInWishlist = wishlist.some((item) => item.id === product.id);

      if (isInWishlist) {
        // Remove from wishlist
        try {
          // Optimistic update
          setWishlist((prev) => prev.filter((item) => item.id !== product.id));

          // Call API
          await removeFromWishlistAPI(product.id);
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          // Rollback on error
          await loadWishlist();
        }
      } else {
        // Add to wishlist
        try {
          // Optimistic update
          setWishlist((prev) => [...prev, product]);

          // Call API
          await addToWishlistAPI(product);
        } catch (error) {
          console.error("Error adding to wishlist:", error);
          // Rollback on error
          await loadWishlist();
        }
      }
    },
    [wishlist],
  );

  return {
    wishlist,
    toggleWishlist,
    loading,
  };
};
