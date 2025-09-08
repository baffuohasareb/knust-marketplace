import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, MessageCircle, Package, Bell, LogOut, Star, Home } from 'lucide-react';
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

  const isActive = (path: string, exact: boolean = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Top Header: brand + user button */}
      <header className="sm:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/buyer/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KM</span>
              </div>
              <span className="text-lg font-bold text-green-600">KNUST Marketplace</span>
            </Link>

            <div className="relative">
              <button
                aria-label="User menu"
                aria-expanded={showUserMenu}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <User className="h-5 w-5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{state.user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/buyer/my-businesses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Businesses
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
          </div>
        </div>
      </header>

      {/* Desktop/Tablet Top Header */}
      <header className="hidden sm:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/buyer/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KM</span>
              </div>
              <span className="text-xl font-bold text-green-600">KNUST Marketplace</span>
            </Link>

            <nav className="hidden sm:flex items-center space-x-6">
              {(() => { const active = isActive('/buyer/orders'); return (
                <Link
                  to="/buyer/orders"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center space-x-1 transition-colors ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <Package className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
                  <span>Orders</span>
                </Link>
              ); })()}
              
              {(() => { const active = isActive('/buyer/favorites'); return (
                <Link
                  to="/buyer/favorites"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center space-x-1 transition-colors ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <Heart className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
                  <span>Saved</span>
                </Link>
              ); })()}

              {(() => { const active = isActive('/reviews'); return (
                <Link
                  to="/reviews"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center space-x-1 transition-colors ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <Star className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
                  <span>Reviews</span>
                </Link>
              ); })()}
              {(() => { const active = isActive('/chat'); return (
                <Link
                  to="/chat"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center space-x-1 transition-colors relative ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <MessageCircle className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
                  <span>Messages</span>
                  {unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              ); })()}

              {(() => { const active = isActive('/notifications'); return (
                <Link
                  to="/notifications"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center space-x-1 transition-colors relative ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <Bell className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              ); })()}

              {(() => { const active = isActive('/cart'); return (
                <Link
                  to="/cart"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center space-x-1 transition-colors relative ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <ShoppingCart className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              ); })()}

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
                      to="/buyer/my-businesses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Businesses
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

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto grid grid-cols-5">
          {(() => { const active = isActive('/buyer/home', true); return (
            <Link to="/buyer/home" aria-current={active ? 'page' : undefined} className={`flex flex-col items-center justify-center py-2 ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}>
              <Home className="h-6 w-6" strokeWidth={active ? 3 : 2} />
              <span className="text-xs">Home</span>
            </Link>
          ); })()}
          {(() => { const active = isActive('/buyer/orders'); return (
            <Link to="/buyer/orders" aria-current={active ? 'page' : undefined} className={`flex flex-col items-center justify-center py-2 ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}>
              <Package className="h-6 w-6" strokeWidth={active ? 3 : 2} />
              <span className="text-xs">Orders</span>
            </Link>
          ); })()}
          {(() => { const active = isActive('/chat'); return (
            <Link to="/chat" aria-current={active ? 'page' : undefined} className={`relative flex flex-col items-center justify-center py-2 ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}>
              <MessageCircle className="h-6 w-6" strokeWidth={active ? 3 : 2} />
              {unreadMessages > 0 && (
                <span className="absolute top-1.5 right-6 bg-red-500 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
              <span className="text-xs">Messages</span>
            </Link>
          ); })()}
          {(() => { const active = isActive('/notifications'); return (
            <Link to="/notifications" aria-current={active ? 'page' : undefined} className={`relative flex flex-col items-center justify-center py-2 ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}>
              <Bell className="h-6 w-6" strokeWidth={active ? 3 : 2} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-6 bg-red-500 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
              <span className="text-xs">Alerts</span>
            </Link>
          ); })()}
          {(() => { const active = isActive('/cart'); return (
            <Link to="/cart" aria-current={active ? 'page' : undefined} className={`relative flex flex-col items-center justify-center py-2 ${active ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`}>
              <ShoppingCart className="h-6 w-6" strokeWidth={active ? 3 : 2} />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-6 bg-green-600 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="text-xs">Cart</span>
            </Link>
          ); })()}
        </div>
      </nav>
    </>
  );
}