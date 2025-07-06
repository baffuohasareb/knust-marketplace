import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MessageCircle, Star, MapPin, Heart, ArrowLeft, ExternalLink, Flag, Calendar, TrendingUp, Shield, Clock } from 'lucide-react';
import { mockBusinesses, mockProducts, mockReviews } from '../../data/mockData';
import ProductCard from '../../components/Product/ProductCard';
import { useApp } from '../../contexts/AppContext';

export default function BusinessProfilePage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('products');

  const business = mockBusinesses.find(b => b.id === businessId);
  const businessProducts = mockProducts.filter(p => p.businessId === businessId);
  const businessReviews = mockReviews.filter(r => r.businessId === businessId);
  const isFavorite = state.favorites.some(fav => fav.id === businessId);

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link to="/buyer/home" className="text-green-600 hover:text-green-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: business });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to businesses
        </Link>

        {/* Business Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={business.logo}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{business.name}</h1>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span>{business.rating} ({business.reviewCount} reviews)</span>
                    </div>
                    {business.isVerified && (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  to={`/report/vendor?businessId=${business.id}`}
                  className="bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  title="Report this vendor"
                >
                  <Flag className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6 text-lg">{business.description}</p>

            {/* Business Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Joined</p>
                <p className="font-semibold">{business.joinedDate ? new Date(business.joinedDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="font-semibold">{business.totalSales || 0}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="font-semibold">{business.responseTime || 'N/A'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold">{business.rating}/5</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              {business.chatEnabled && (
                <Link
                  to={`/chat/${business.id}`}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat with seller</span>
                </Link>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
              )}

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call</span>
                </a>
              )}

              <button
                onClick={handleToggleFavorite}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {business.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Products & Services ({businessProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({businessReviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                {businessProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businessProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No products available yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {businessReviews.length > 0 ? (
                  <div className="space-y-6">
                    {businessReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=10b981&color=fff`}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900 flex items-center space-x-2">
                                  <span>{review.userName}</span>
                                  {review.verified && (
                                    <Shield className="h-4 w-4 text-green-600" title="Verified Purchase" />
                                  )}
                                </p>
                                <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3">{review.comment}</p>
                            {review.helpful && review.helpful > 0 && (
                              <p className="text-sm text-gray-500">{review.helpful} people found this helpful</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Be the first to review this business!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}