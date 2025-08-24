import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/common';
import ErrorBoundary from './components/common/ErrorBoundary';
import { BrowsePage, ProductDetailPage, AccountPage } from './pages';
import { useCart, useWishlist } from './hooks';
import { mockUser } from './data';

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState(mockUser);

  const cart = useCart();
  const wishlist = useWishlist();

  const sharedProps = {
    cart,
    wishlist,
    setSelectedProduct,
    user
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header 
            cart={cart}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          
          <Routes>
            <Route 
              path="/" 
              element={<BrowsePage {...sharedProps} />} 
            />
            <Route 
              path="/browse" 
              element={<BrowsePage {...sharedProps} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetailPage {...sharedProps} selectedProduct={selectedProduct} />} 
            />
            <Route 
              path="/account" 
              element={<AccountPage {...sharedProps} />} 
            />
            <Route 
              path="/account/:tab" 
              element={<AccountPage {...sharedProps} />} 
            />
          </Routes>
          
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
