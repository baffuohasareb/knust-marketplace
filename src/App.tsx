import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Layout/Header';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BuyerHomePage from './pages/buyer/BuyerHomePage';
import BusinessProfilePage from './pages/business/BusinessProfilePage';
import ProductDetailsPage from './pages/product/ProductDetailsPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/order/OrderSuccessPage';
import OrderTrackingPage from './pages/order/OrderTrackingPage';
import ChatPage from './pages/chat/ChatPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ReportVendorPage from './pages/report/ReportVendorPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import WriteReviewPage from './pages/reviews/WriteReviewPage';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:userType" element={<LoginPage />} />
          
          {/* Protected Buyer Routes */}
          <Route path="/buyer/home" element={
            <ProtectedRoute>
              <BuyerHomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/business/:businessId" element={
            <ProtectedRoute>
              <BusinessProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/product/:productId" element={
            <ProtectedRoute>
              <ProductDetailsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          
          <Route path="/order/:orderId/success" element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } />

          <Route path="/order/:orderId" element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          } />

          <Route path="/chat/:vendorId?" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />

          <Route path="/report/vendor" element={
            <ProtectedRoute>
              <ReportVendorPage />
            </ProtectedRoute>
          } />

          <Route path="/reviews" element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          } />

          <Route path="/reviews/write" element={
            <ProtectedRoute>
              <WriteReviewPage />
            </ProtectedRoute>
          } />
          {/* Placeholder routes for features mentioned in spec but not fully implemented */}
          <Route path="/buyer/orders" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders Page</h2>
                  <p className="text-gray-600 mb-4">This feature will display your order history</p>
                  <a href="/buyer/home" className="text-green-600 hover:text-green-700">Back to home</a>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/buyer/favorites" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Favorites Page</h2>
                  <p className="text-gray-600 mb-4">This feature will display your favorite businesses</p>
                  <a href="/buyer/home" className="text-green-600 hover:text-green-700">Back to home</a>
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Page</h2>
                  <p className="text-gray-600 mb-4">This feature will display your profile information</p>
                  <a href="/buyer/home" className="text-green-600 hover:text-green-700">Back to home</a>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;