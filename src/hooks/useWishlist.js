import { useState } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return {
    wishlist,
    toggleWishlist
  };
};
