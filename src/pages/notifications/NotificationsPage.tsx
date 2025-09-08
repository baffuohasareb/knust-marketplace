// Notifications are derived from persisted orders in app state
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Package } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function NotificationsPage() {
  const { state } = useApp();

  // Derive alerts directly from persisted orders
  const notifications = state.orders
    .map((order) => ({
      id: order.id,
      type: 'order_update' as const,
      title: `Order #${order.id} — ${order.status.replace('-', ' ')}`,
      message: `Placed on ${new Date(order.createdAt).toLocaleString()} | Items: ${order.items.length} | Total: ₵${order.total.toFixed(2)} | Payment: ${order.paymentMethod}`,
      createdAt: order.createdAt,
      actionUrl: `/order/${order.id}`,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getNotificationIcon = () => <Package className="h-5 w-5" />;
  const getNotificationColor = () => 'text-blue-600 bg-blue-100';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
            <p className="text-sm text-gray-600">Showing {notifications.length} update{notifications.length !== 1 ? 's' : ''} from your orders</p>
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h2>
              <p className="text-gray-600">You'll see updates about your orders and messages here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor()}`}>
                      {getNotificationIcon()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-700">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <Link
                            to={notification.actionUrl}
                            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            View details →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}