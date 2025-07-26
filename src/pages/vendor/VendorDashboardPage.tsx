import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Package, Star, MessageCircle, Settings, Plus, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockUserBusinesses } from '../../data/mockData';

export default function VendorDashboardPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { state } = useApp();

  const business = mockUserBusinesses.find(b => b.id === vendorId);
  const userBusinesses = mockUserBusinesses;

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link to="/buyer/my-businesses" className="text-green-600 hover:text-green-700">
            Back to my businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/buyer/my-businesses"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to my businesses
          </Link>

          {userBusinesses.length > 1 && (
            <div className="relative">
              <select
                value={vendorId}
                onChange={(e) => window.location.href = `/vendor/${e.target.value}/dashboard`}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {userBusinesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Business Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            <img
              src={business.logo}
              alt={business.name}
              className="w-20 h-20 rounded-xl object-cover border border-gray-200"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                <Link
                  to={`/vendor/${business.id}/settings`}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>
              <p className="text-gray-600 mb-4">{business.description}</p>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {business.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500">
                  Created {new Date(business.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{business.productCount}</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Products</h3>
            <p className="text-sm text-gray-600">Active listings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Orders</h3>
            <p className="text-sm text-gray-600">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {business.rating ? business.rating.toFixed(1) : 'N/A'}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Rating</h3>
            <p className="text-sm text-gray-600">{business.reviewCount} reviews</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Messages</h3>
            <p className="text-sm text-gray-600">Unread</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to={`/vendor/${business.id}/products/add`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Add Product</h3>
                <p className="text-sm text-gray-600">List a new product or service</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/vendor/${business.id}/orders`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and update orders</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/vendor/${business.id}/analytics`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">View performance metrics</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600 mb-6">
              Start by adding your first product to see activity here
            </p>
            <Link
              to={`/vendor/${business.id}/products/add`}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}