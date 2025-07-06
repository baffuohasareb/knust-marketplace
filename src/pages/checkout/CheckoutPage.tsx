import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function CheckoutPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState({
    hall: '',
    room: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5;
  const total = subtotal + deliveryFee;

  const halls = [
    'Unity Hall', 'Katanga Hall', 'Queen Elizabeth II Hall', 'Africa Hall',
    'Ghana Hall', 'Jean Nelson Aka Hall', 'Liman Hall', 'Alexander Kwapong Hall'
  ];

  const paymentMethods = [
    { id: 'mtn', name: 'MTN Mobile Money', icon: '📱' },
    { id: 'vodafone', name: 'Vodafone Cash', icon: '📱' },
    { id: 'airteltigo', name: 'AirtelTigo Money', icon: '📱' },
    { id: 'campus-pay', name: 'Campus Pay', icon: '💳', disabled: true }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = `ORD${Date.now()}`;
      const order = {
        id: orderId,
        items: state.cart,
        total,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        deliveryInfo,
        paymentMethod: paymentMethods.find(p => p.id === paymentMethod)?.name || '',
        deliveryContact: '+233241234567'
      };

      dispatch({ type: 'ADD_ORDER', payload: order });
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order/${orderId}/success`);
    }, 2000);
  };

  if (state.cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/cart"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="hall" className="block text-sm font-medium text-gray-700 mb-2">
                      Hall *
                    </label>
                    <select
                      id="hall"
                      value={deliveryInfo.hall}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, hall: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your hall</option>
                      {halls.map((hall) => (
                        <option key={hall} value={hall}>{hall}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      id="room"
                      value={deliveryInfo.room}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, room: e.target.value })}
                      placeholder="e.g., A205"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      value={deliveryInfo.landmark}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, landmark: e.target.value })}
                      placeholder="e.g., Near the main entrance"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                        method.disabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : paymentMethod === method.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={method.disabled}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className={`font-medium ${method.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                            {method.name}
                          </p>
                          {method.disabled && (
                            <p className="text-sm text-gray-500">Coming soon</p>
                          )}
                        </div>
                      </div>
                      {!method.disabled && (
                        <div className={`ml-auto w-4 h-4 rounded-full border-2 ${
                          paymentMethod === method.id ? 'border-green-600 bg-green-600' : 'border-gray-300'
                        }`}>
                          {paymentMethod === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !deliveryInfo.hall || !deliveryInfo.room || !paymentMethod}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-colors ${
                  loading || !deliveryInfo.hall || !deliveryInfo.room || !paymentMethod
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Processing Payment...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {state.cart.map((item) => (
                  <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">₵{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₵{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'Free' : `₵${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>₵{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}