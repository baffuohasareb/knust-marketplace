import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Search,
  Filter,
  MapPin,
  Star,
  Trash2,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import BusinessCard from "../../components/Business/BusinessCard";
import EmptyState from "../../components/Common/EmptyState";

export default function SavedBusinessesPage() {
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "Electronics",
    "Food",
    "Stationery",
    "Books",
    "Beverages",
    "Accessories",
  ];

  const filteredBusinesses = favorites.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      business.categories.some((cat) => cat === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleRemoveFromFavorites = (businessId: string) => {
    const business = favorites.find((b) => b.id === businessId);
    if (business) {
      toggleFavorite(business);
    }
  };

  const clearAllFavorites = () => {
    if (
      window.confirm("Are you sure you want to remove all saved businesses?")
    ) {
      favorites.forEach((business) => {
        toggleFavorite(business);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <span>Saved Businesses</span>
            </h1>
            <p className="text-gray-600 mt-1">
              {favorites.length} saved business
              {favorites.length !== 1 ? "es" : ""}
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved businesses yet"
            description="Save your favorite businesses to easily find them later"
            actionText="Discover Businesses"
            actionLink="/buyer/home"
          />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search saved businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    title="Filter by category"
                    aria-label="Filter by category"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredBusinesses.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No businesses found"
                description={`No saved businesses match "${searchQuery}" in ${
                  selectedCategory === "all" ? "any category" : selectedCategory
                }`}
                actionText="Clear Search"
                onAction={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Showing {filteredBusinesses.length} of {favorites.length}{" "}
                    saved business{favorites.length !== 1 ? "es" : ""}
                  </p>
                  {(searchQuery || selectedCategory !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <div key={business.id} className="relative">
                      <BusinessCard business={business} />
                      <button
                        onClick={() => handleRemoveFromFavorites(business.id)}
                        className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors z-10"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
