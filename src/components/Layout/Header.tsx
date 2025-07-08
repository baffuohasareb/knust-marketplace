import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, MessageCircle, Package, Bell, LogOut, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  if (location.pathname === '/' || location.pathname.startsWith('/login')) {
    return null;
  }

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = state.notifications.filter(n => !n.read).length;
  const unreadMessages = state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/buyer/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KM</span>
            </div>
            <span className="text-xl font-bold text-green-600">KNUST Marketplace</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/buyer/orders"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">Orders</span>
            </Link>
            
            <Link
              to="/buyer/favorites"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>

            <Link
              to="/reviews"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Star className="h-5 w-5" />
              <span className="hidden sm:inline">Reviews</span>
            </Link>
            <Link
              to="/chat"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Messages</span>
              {unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Link>

            <Link
              to="/notifications"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">{state.user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                    <p className="text-xs text-gray-500">{state.user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/buyer/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}