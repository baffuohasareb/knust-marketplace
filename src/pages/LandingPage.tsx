import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

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

          {/* Sign In Button */}
          <div className="mb-16">
            <Link
              to="/login/buyer"
              className="inline-block group"
            >
              <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group-hover:border-green-300 max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <ShoppingBag className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to KNUST Marketplace</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sign in with your KNUST credentials to start shopping, selling, and connecting with fellow students
                </p>
                <div className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg group-hover:bg-green-700 transition-colors shadow-lg">
                  Sign In with KNUST Account
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