import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X } from 'lucide-react';

const WishlistTab = ({ wishlist, cart }) => {
  const navigate = useNavigate();

  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Wishlist ({wishlist.wishlist.length} items)
        </h2>
      </div>
      
      {wishlist.wishlist.length === 0 ? (
        <div className="p-6 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          <button
            className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => navigate('/browse')}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.wishlist.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-3 cursor-pointer"
                onClick={() => handleProductClick(item)}
              />
              <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="font-bold text-indigo-600 mb-3">${item.price}</p>
              <div className="flex space-x-2">
                <button
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded text-sm hover:bg-indigo-700"
                  onClick={() => cart.addToCart(item)}
                >
                  Add to Cart
                </button>
                <button
                  className="p-2 text-red-600 hover:text-red-700"
                  onClick={() => wishlist.toggleWishlist(item)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
