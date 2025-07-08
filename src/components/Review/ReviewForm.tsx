import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface ReviewFormProps {
  businessId?: string;
  productId?: string;
  orderId?: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ businessId, productId, orderId, onSubmit, onCancel }: ReviewFormProps) {
  const { state, dispatch } = useApp();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files].slice(0, 3)); // Max 3 images
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);

    // Simulate image upload and review submission
    setTimeout(() => {
      const review = {
        id: Date.now().toString(),
        userId: state.user?.id || '1',
        userName: state.user?.name || 'Anonymous',
        userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name || 'Anonymous')}&background=10b981&color=fff`,
        businessId,
        productId,
        orderId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        verified: !!orderId,
        helpful: 0,
        images: images.map((_, index) => `https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400&t=${Date.now()}-${index}`)
      };

      dispatch({ type: 'ADD_REVIEW', payload: review });
      
      // Add notification for successful review
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: state.user?.id || '1',
          type: 'review',
          title: 'Review Submitted',
          message: 'Thank you for your review! It helps other students make better decisions.',
          read: false,
          createdAt: new Date().toISOString()
        }
      });

      setLoading(false);
      onSubmit();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-sm text-gray-600">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Share your experience with other students..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Be honest and helpful. Your review will help other students make informed decisions.
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload photos to help others see your experience
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="review-images"
            />
            <label
              htmlFor="review-images"
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm"
            >
              Choose Photos
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Max 3 photos, 5MB each
            </p>
          </div>

          {images.length > 0 && (
            <div className="mt-3 flex space-x-3">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Focus on your actual experience with the product/service</li>
            <li>• Avoid personal attacks or inappropriate language</li>
            <li>• Include specific details that would help other buyers</li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || rating === 0 || !comment.trim()}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              loading || rating === 0 || !comment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}