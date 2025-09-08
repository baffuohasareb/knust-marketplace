import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  MessageCircle,
  Package,
  Bell,
  LogOut,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "../../stores/useStore";

export default function Header() {
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart);
  const notifications = useStore((state) => state.notifications);
  const conversations = useStore((state) => state.conversations);
  const logout = useStore((state) => state.logout);
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (location.pathname === "/" || location.pathname.startsWith("/login")) {
    return null;
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu) {
        const target = event.target as Element;
        if (!target.closest('.mobile-menu-container')) {
          setShowMobileMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/buyer/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KM</span>
            </div>
            <span className="text-xl font-bold text-green-600 hidden sm:block">
              KNUST Marketplace
            </span>
            <span className="text-lg font-bold text-green-600 sm:hidden">
              KM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/buyer/orders"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>Orders</span>
            </Link>

            <Link
              to="/buyer/favorites"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span>Saved</span>
            </Link>

            <Link
              to="/reviews"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Star className="h-5 w-5" />
              <span>Reviews</span>
            </Link>

            <Link
              to="/chat"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Messages</span>
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
              <span>Notifications</span>
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
              <span>Cart</span>
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
                <span className="text-sm">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={closeUserMenu}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/buyer/my-businesses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={closeUserMenu}
                  >
                    My Businesses
                  </Link>
                  <Link
                    to="/buyer/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={closeUserMenu}
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

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Messages */}
            <Link
              to="/chat"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Link>

            {/* Mobile Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <div className="lg:hidden border-t border-gray-200 bg-white mobile-menu-container animate-in slide-in-from-top-2 duration-200 relative z-50">
              <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation Links */}
              <Link
                to="/buyer/orders"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                <Package className="h-5 w-5" />
                <span>Orders</span>
              </Link>

              <Link
                to="/buyer/favorites"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                <Heart className="h-5 w-5" />
                <span>Saved</span>
              </Link>

              <Link
                to="/reviews"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                <Star className="h-5 w-5" />
                <span>Reviews</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/buyer/my-businesses"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                <Package className="h-5 w-5" />
                <span>My Businesses</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </header>
  );
}
