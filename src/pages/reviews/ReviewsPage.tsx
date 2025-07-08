import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Star, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockReviews } from '../../data/mockData';
import ReviewCard from '../../components/Review/ReviewCard';
import ReviewSummary from '../../components/Review/ReviewSummary';

export default function ReviewsPage() {
  const { state } = useApp();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Combine mock reviews with user reviews
  const allReviews = [...mockReviews, ...state.reviews];
  
  // Filter and sort reviews
  let filteredReviews = allReviews;
  
  if (filterRating) {
    filteredReviews = filteredReviews.filter(review => review.rating === filterRating);
  }

  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Calculate review statistics
  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
    : 0;

  const ratingDistribution = allReviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Reviews</h1>
          <Link
            to="/reviews/write"
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Write Review</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Summary */}
            <ReviewSummary
              averageRating={averageRating}
              totalReviews={allReviews.length}
              ratingDistribution={ratingDistribution}
            />

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilterRating(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filterRating === null ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      All Ratings
                    </button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilterRating(rating)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                          filterRating === rating ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span>({ratingDistribution[rating] || 0})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            {filteredReviews.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600 mb-6">
                  {filterRating ? `No reviews with ${filterRating} star${filterRating !== 1 ? 's' : ''} found.` : 'No reviews available yet.'}
                </p>
                {!filterRating && (
                  <Link
                    to="/reviews/write"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Write the first review</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredReviews.length} of {allReviews.length} review{allReviews.length !== 1 ? 's' : ''}
                  </p>
                  {filterRating && (
                    <button
                      onClick={() => setFilterRating(null)}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Clear filter
                    </button>
                  )}
                </div>

                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    showProductInfo={true}
                    showBusinessInfo={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}