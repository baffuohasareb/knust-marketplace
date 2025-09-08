import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Package, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const { state } = useApp();
  const orders = state.orders;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link to="/buyer/home" className="text-green-600 hover:text-green-700">Back to home</Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Your orders will appear here after you checkout.</p>
            <Link to="/buyer/home" className="inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
              <span>Browse products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Placed {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₵{order.total.toFixed(2)}</p>
                      <span className="text-sm text-gray-600 capitalize">{order.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">₵{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-gray-500">+ {order.items.length - 3} more item(s)</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      to={`/order/${order.id}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <span>View details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
