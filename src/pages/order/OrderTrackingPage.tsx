import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, MessageCircle, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockOrders } from '../../data/mockData';

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { state, dispatch } = useApp();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const order = mockOrders.find(o => o.id === orderId) || state.orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/buyer/orders" className="text-green-600 hover:text-green-700">
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="h-5 w-5" />;
      case 'preparing':
      case 'ready':
        return <Package className="h-5 w-5" />;
      case 'out-for-delivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'ready':
      case 'out-for-delivery':
        return 'text-orange-600 bg-orange-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const review = {
      id: Date.now().toString(),
      userId: state.user?.id || '1',
      userName: state.user?.name || 'Anonymous',
      orderId: order.id,
      businessId: order.items[0]?.businessName || '',
      rating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
      verified: true
    };

    dispatch({ type: 'ADD_REVIEW', payload: review });
    setShowReviewModal(false);
    setRating(0);
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/orders"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status.replace('-', ' ')}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Total: ₵{order.total.toFixed(2)}</p>
                <p className="text-gray-600">Payment: {order.paymentMethod}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{order.deliveryInfo.hall}</p>
                <p>Room {order.deliveryInfo.room}</p>
                {order.deliveryInfo.landmark && <p>{order.deliveryInfo.landmark}</p>}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
              <div className="space-y-2">
                {order.deliveryContact && (
                  <a
                    href={`tel:${order.deliveryContact}`}
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call delivery</span>
                  </a>
                )}
                <Link
                  to={`/chat/${order.items[0]?.businessName}`}
                  className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message seller</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Tracking</h2>
          
          <div className="space-y-6">
            {order.trackingUpdates?.map((update, index) => (
              <div key={update.id} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(update.status)}`}>
                  {getStatusIcon(update.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {update.status.replace('-', ' ')}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(update.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{update.message}</p>
                  {update.location && (
                    <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{update.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Estimated delivery:</strong> {new Date(order.estimatedDelivery).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.businessName}</p>
                  {(item.selectedSize || item.selectedColor) && (
                    <div className="flex items-center space-x-2 mt-1">
                      {item.selectedSize && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">₵{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {order.status === 'delivered' && order.canReview && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rate Your Experience</h2>
            <p className="text-gray-600 mb-4">Help other students by sharing your experience with this order.</p>
            <div className="flex space-x-4">
              <Link
                to={`/reviews/write?orderId=${order.id}&businessId=${order.items[0]?.businessName}`}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Star className="h-5 w-5" />
                <span>Review Business</span>
              </Link>
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Star className="h-5 w-5" />
                <span>Quick Review</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Review Modal */}
        {order.status === 'delivered' && order.canReview && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rate Your Experience</h2>
            <p className="text-gray-600 mb-4">Help other students by sharing your experience with this order.</p>
            <Link
              to={`/reviews/write?orderId=${order.id}&businessId=${order.items[0]?.businessName}`}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex"
            >
              <Star className="h-5 w-5" />
              <span>Write a Review</span>
            </Link>
          </div>
        )}

        {/* Quick Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Order</h3>
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    id="comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rating === 0}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      rating > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}