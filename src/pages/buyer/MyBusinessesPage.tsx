import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Star,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";
import { useStore } from "../../stores/useStore";

export default function MyBusinessesPage() {
  const userBusinesses = useStore((state) => state.userBusinesses);

  const getBusinessTypeLabel = (type: string) => {
    switch (type) {
      case "goods":
        return "Goods";
      case "services":
        return "Services";
      case "both":
        return "Both";
      default:
        return "Unknown";
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case "goods":
        return "bg-blue-100 text-blue-800";
      case "services":
        return "bg-purple-100 text-purple-800";
      case "both":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
            <p className="text-gray-600 mt-1">
              Manage your {userBusinesses.length} business
              {userBusinesses.length !== 1 ? "es" : ""}
            </p>
          </div>

          <Link
            to="/vendor/onboarding/start"
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Business</span>
          </Link>
        </div>

        {userBusinesses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No businesses yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your entrepreneurial journey by creating your first business
              on the KNUST Marketplace
            </p>
            <Link
              to="/vendor/onboarding/start"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Business</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                        {business.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {business.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getBusinessTypeColor(
                            business.businessType
                          )}`}
                        >
                          {getBusinessTypeLabel(business.businessType)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {business.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-bold text-gray-900">
                          {business.productCount}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Products</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold text-gray-900">
                          {business.rating ? business.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-bold text-gray-900">
                          {business.reviewCount}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Reviews</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/vendor/${business.id}/dashboard`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-green-700 transition-colors"
                    >
                      Open Dashboard
                    </Link>
                    <Link
                      to={`/vendor/${business.id}/settings`}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div
                  className={`px-6 py-3 border-t border-gray-200 ${
                    business.isActive ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        business.isActive ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {business.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Updated{" "}
                      {new Date(business.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
