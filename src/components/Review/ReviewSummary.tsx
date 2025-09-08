import { Star } from 'lucide-react';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export default function ReviewSummary({ averageRating, totalReviews, ratingDistribution }: ReviewSummaryProps) {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
      
      <div className="flex items-center space-x-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3 mb-2">
              <span className="text-sm text-gray-600 w-8">{rating}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(ratingDistribution[rating] || 0)}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">
                {ratingDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(getPercentage((ratingDistribution[5] || 0) + (ratingDistribution[4] || 0)))}%
          </div>
          <p className="text-xs text-gray-600">Positive</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {Math.round(getPercentage(ratingDistribution[3] || 0))}%
          </div>
          <p className="text-xs text-gray-600">Neutral</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {Math.round(getPercentage((ratingDistribution[2] || 0) + (ratingDistribution[1] || 0)))}%
          </div>
          <p className="text-xs text-gray-600">Negative</p>
        </div>
      </div>
    </div>
  );
}