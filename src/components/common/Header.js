import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = ({ 
  cart, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-2xl font-bold text-gray-900 ml-2 md:ml-0">
              StyleHub
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/browse"
              className={`text-sm font-medium ${
                currentPath === '/' || currentPath === '/browse'
                  ? 'text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Browse
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/account/cart"
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <ShoppingCart size={24} />
              {cart.getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                  {cart.getTotalItems()}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <User size={24} />
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <Link
              to="/browse"
              className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                currentPath === '/' || currentPath === '/browse'
                  ? 'text-indigo-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
