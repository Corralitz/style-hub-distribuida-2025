import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ShoppingCart, Heart, Package } from 'lucide-react';
import ProfileTab from '../components/account/ProfileTab';
import CartTab from '../components/account/CartTab';
import WishlistTab from '../components/account/WishlistTab';
import OrdersTab from '../components/account/OrdersTab';

const AccountPage = ({ 
  user, 
  cart, 
  wishlist, 
  setSelectedProduct 
}) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Set active tab based on URL parameter
    if (tab && ['profile', 'cart', 'wishlist', 'orders'].includes(tab)) {
      setActiveTab(tab);
    } else if (tab) {
      // Invalid tab, redirect to profile
      navigate('/account/profile');
    }
  }, [tab, navigate]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/account/${newTab}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="bg-white rounded-lg shadow p-4">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange('profile')}
                >
                  <User size={20} className="mr-3" />
                  Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'cart' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange('cart')}
                >
                  <ShoppingCart size={20} className="mr-3" />
                  Cart ({cart.getTotalItems()})
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'wishlist' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange('wishlist')}
                >
                  <Heart size={20} className="mr-3" />
                  Wishlist ({wishlist.wishlist.length})
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange('orders')}
                >
                  <Package size={20} className="mr-3" />
                  Orders
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'cart' && <CartTab cart={cart} />}
          {activeTab === 'wishlist' && (
            <WishlistTab 
              wishlist={wishlist} 
              cart={cart}
              setSelectedProduct={setSelectedProduct}
            />
          )}
          {activeTab === 'orders' && <OrdersTab />}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
