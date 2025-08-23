import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../data';
import ProductCard from '../components/product/ProductCard';
import SearchAndFilters from '../components/filters/SearchAndFilters';

const BrowsePage = ({ setSelectedProduct, cart, wishlist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product) => {
    cart.addToCart(product);
  };

  const handleToggleWishlist = (product) => {
    wishlist.toggleWishlist(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.wishlist.some(item => item.id === product.id)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
