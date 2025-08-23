import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist 
}) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-lg cursor-pointer"
          onClick={handleProductClick}
        />
        <button
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isInWishlist
              ? 'bg-red-100 text-red-600'
              : 'bg-white text-gray-400 hover:text-red-600'
          }`}
          onClick={() => onToggleWishlist(product)}
        >
          <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 
          className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-indigo-600"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              product.inStock
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => product.inStock && onAddToCart(product)}
            disabled={!product.inStock}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
