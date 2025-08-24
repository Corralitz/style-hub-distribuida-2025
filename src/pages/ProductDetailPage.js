import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Plus, Minus } from 'lucide-react';
import { useProduct } from '../hooks/useContentful';

const ProductDetailPage = ({ 
  selectedProduct, 
  setSelectedProduct,
  cart, 
  wishlist 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || 'Black');
    }
  }, [product, setSelectedProduct]);

  const handleAddToCart = () => {
    if (product && product.inStock) {
      for (let i = 0; i < quantity; i++) {
        cart.addToCart(product, selectedSize, selectedColor);
      }
    }
  };

  const handleBackToBrowse = () => {
    navigate('/browse');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
          onClick={handleBackToBrowse}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Product not found or error loading product details.
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.wishlist.some(item => item.id === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        onClick={handleBackToBrowse}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 lg:h-full object-cover rounded-lg"
          />
          <button
            className={`absolute top-4 right-4 p-3 rounded-full ${
              isInWishlist
                ? 'bg-red-100 text-red-600'
                : 'bg-white text-gray-400 hover:text-red-600'
            }`}
            onClick={() => wishlist.toggleWishlist(product)}
          >
            <Heart size={24} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
          </div>

          <p className="text-2xl font-bold text-gray-900 mb-6">${product.price}</p>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    selectedSize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    selectedColor === color
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center">
              <button
                className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 border-t border-b border-gray-300 min-w-16 text-center">
                {quantity}
              </span>
              <button
                className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`w-full py-3 px-6 rounded-lg font-medium ${
              product.inStock
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
