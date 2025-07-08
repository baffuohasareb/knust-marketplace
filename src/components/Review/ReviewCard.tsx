import React, { useState } from 'react';
import { Star, ThumbsUp, Shield, MoreVertical, Flag } from 'lucide-react';
import { Review } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface ReviewCardProps {
  review: Review;
  showProductInfo?: boolean;
  showBusinessInfo?: boolean;
}

export default function ReviewCard({ review, showProductInfo = false, showBusinessInfo = false }: ReviewCardProps) {
  const { state } = useApp();
  const [isHelpful, setIsHelpful] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleHelpfulClick = () => {
    setIsHelpful(!isHelpful);
    // In a real app, this would update the helpful count in the backend
  };

  const handleReport = () => {
    alert('Review reported. We will investigate this review.');
    setShowMenu(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=10b981&color=fff`}
            alt={review.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  <Shield className="h-3 w-3" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={handleReport}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Flag className="h-3 w-3" />
                  <span>Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProductInfo && review.productId && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Product reviewed</p>
        </div>
      )}

      {showBusinessInfo && review.businessId && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Business reviewed</p>
        </div>
      )}

      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleHelpfulClick}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            isHelpful
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${isHelpful ? 'fill-current' : ''}`} />
          <span>Helpful ({(review.helpful || 0) + (isHelpful ? 1 : 0)})</span>
        </button>

        {review.orderId && (
          <span className="text-xs text-gray-500">Order #{review.orderId}</span>
        )}
      </div>
    </div>
  );
}