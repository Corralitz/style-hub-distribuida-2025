import React from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

const CartTab = ({ cart, setCurrentPage }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({cart.getTotalItems()} items)
        </h2>
      </div>
      
      {cart.cart.length === 0 ? (
        <div className="p-6 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <button
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => setCurrentPage('browse')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="p-6">
            {cart.cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}-${item.color}`} 
                className="flex items-center py-4 border-b border-gray-200 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size}, Color: {item.color}</p>
                  <p className="font-bold text-indigo-600">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    onClick={() => cart.updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    onClick={() => cart.updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    className="ml-4 text-red-600 hover:text-red-700"
                    onClick={() => cart.removeFromCart(item.id, item.size, item.color)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">
                Total: ${cart.getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium">
                Checkout
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium"
                onClick={() => setCurrentPage('browse')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartTab;
