import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-2xl">KM</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              KNUST <span className="text-green-600">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your campus marketplace connecting students with local businesses. 
              Buy, sell, and discover amazing products and services right here at KNUST.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/login/buyer"
              className="group w-full sm:w-auto"
            >
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-green-300">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in as Buyer</h3>
                <p className="text-gray-600 mb-4">
                  Discover and purchase from campus businesses
                </p>
                <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-green-700 transition-colors">
                  Start Shopping
                </div>
              </div>
            </Link>

            <Link
              to="/login/seller"
              className="group w-full sm:w-auto"
            >
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-green-300">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Store className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in as Seller</h3>
                <p className="text-gray-600 mb-4">
                  Sell your products and services to students
                </p>
                <div className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-gray-900 transition-colors">
                  Start Selling
                </div>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">🎓</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Student-Exclusive</h4>
              <p className="text-gray-600 text-sm">
                Designed specifically for KNUST students with UITS authentication
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Campus Delivery</h4>
              <p className="text-gray-600 text-sm">
                Fast and convenient delivery right to your hall
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">💬</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Direct Communication</h4>
              <p className="text-gray-600 text-sm">
                Chat directly with sellers for personalized service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}