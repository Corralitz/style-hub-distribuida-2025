import { useState } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, size = 'M', color = product.colors[0]) => {
    const existingItem = cart.find(item => 
      item.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, size, color, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId, size, color) => {
    setCart(cart.filter(item => 
      !(item.id === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId, size, color);
    } else {
      setCart(cart.map(item =>
        item.id === productId && item.size === size && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems
  };
};
