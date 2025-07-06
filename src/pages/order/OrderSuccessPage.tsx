import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, MessageCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { state } = useApp();
  
  const order = state.orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/buyer/home" className="text-green-600 hover:text-green-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 p-8 text-center border-b border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-green-700">
              Your order has been confirmed and is being prepared
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-orange-600 font-medium capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">₵{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hall:</span>
                    <span className="font-medium">{order.deliveryInfo.hall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{order.deliveryInfo.room}</span>
                  </div>
                  {order.deliveryInfo.landmark && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Landmark:</span>
                      <span className="font-medium">{order.deliveryInfo.landmark}</span>
                    </div>
                  )}
                  {order.deliveryContact && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{order.deliveryContact}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/order/${order.id}`}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>Track Order</span>
              </Link>

              <Link
                to="/buyer/orders"
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>View All Orders</span>
              </Link>

              <Link
                to="/buyer/home"
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <p>Your order is being prepared by the seller</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <p>You'll receive updates about your order status</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <p>Your order will be delivered to your specified location</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <p>After delivery, you can rate and review your experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}