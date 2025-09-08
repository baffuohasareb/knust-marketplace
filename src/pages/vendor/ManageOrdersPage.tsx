import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, X, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useOrdersStore } from '../../store/ordersStore';
import { mockBusinesses } from '../../data/mockData';
import type { VendorOrder } from '../../types';
import EmptyState from '../../components/Common/EmptyState';

export default function ManageOrdersPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { state, dispatch } = useApp();
  const ordersStore = useOrdersStore();
  const storeVendorOrders = ordersStore.vendorOrders as VendorOrder[];
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  // const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  let business = state.userBusinesses.find(b => b.id === vendorId);
  // Fallback: allow managing orders for marketplace businesses (ids like '1','2','3')
  if (!business) {
    const m = mockBusinesses.find(b => b.id === vendorId);
    if (m) {
      business = {
        id: m.id,
        ownerId: 'marketplace',
        name: m.name,
        description: m.description,
        logo: m.logo,
        businessType: 'both' as const,
        category: m.categories?.[0] || m.location || 'General',
        tags: m.categories || [],
        contactInfo: { hall: m.location || '', room: '', landmark: '', phone: m.phone || '', whatsapp: m.whatsapp || '' },
        delivery: { available: !!m.deliveryAvailable, fee: 0, coverage: '' },
        productCount: m.totalSales || 0,
        rating: m.rating,
        reviewCount: m.reviewCount || 0,
        isActive: true,
        createdAt: m.joinedDate || new Date().toISOString(),
        updatedAt: m.joinedDate || new Date().toISOString(),
      } as any;
    }
  }
  // Build acceptable business ids for this view (support vendor-owned id and marketplace id)
  const linkedMarketplace = mockBusinesses.find((mb) => business && mb.name === business.name);
  const businessIdSet = new Set<string>();
  if (vendorId) businessIdSet.add(vendorId);
  if (linkedMarketplace) businessIdSet.add(linkedMarketplace.id);

  const orders = (storeVendorOrders).filter(order => businessIdSet.has(order.businessId));

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { value: 'out-for-delivery', label: 'Out for Delivery', count: orders.filter(o => o.status === 'out-for-delivery').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Update in both Zustand and Context to keep legacy consumers in sync
    ordersStore.updateVendorOrderStatus(orderId, newStatus as any);
    dispatch({ type: 'UPDATE_VENDOR_ORDER_STATUS', payload: { orderId, status: newStatus as any } });
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const statusText = newStatus.replace(/-/g, ' ');
      const title = `Order ${order.id} ${statusText}`;
      const message = `Your order at ${business?.name || 'the vendor'} is now "${statusText}".`;
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `N${Date.now()}`,
          userId: order.customerId, // for demo, NotificationsPage shows all
          type: 'order_update',
          title,
          message,
          read: false,
          createdAt: new Date().toISOString(),
          // we don't have the buyer orderId mapping here; leaving actionUrl undefined
        },
      });

      // Sync buyer order status if we have the mapping
      const buyerOrderId = (order as any).buyerOrderId as string | undefined;
      if (buyerOrderId) {
        const update = {
          id: `U${Date.now()}`,
          status: newStatus as any,
          message: `Seller updated status to ${statusText}`,
          timestamp: new Date().toISOString(),
        };
        // Update AppContext order
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: buyerOrderId, status: newStatus as any, update } as any });
        // Update persisted order store
        ordersStore.updateOrderStatus(buyerOrderId, newStatus as any, { trackingUpdates: [update] } as any);
      }
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link to="/buyer/my-businesses" className="text-green-600 hover:text-green-700">
            Back to my businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/vendor/${vendorId}/dashboard`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            <p className="text-gray-600 mt-1">{business.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Status Filter Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filter by Status</h3>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      selectedStatus === option.value
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedStatus === option.value
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3">
            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No orders found"
                description={
                  selectedStatus === 'all'
                    ? "You haven't received any orders yet."
                    : `No orders with status "${selectedStatus}".`
                }
                actionText={selectedStatus !== 'all' ? "View all orders" : undefined}
                onAction={selectedStatus !== 'all' ? () => setSelectedStatus('all') : undefined}
              />
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status.replace('-', ' ')}</span>
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
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
                            <p className="font-semibold text-gray-900">₵{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Customer & Delivery Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Customer Info</h4>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerContact}</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                          <p className="text-sm text-gray-600">{order.deliveryInfo.hall}</p>
                          <p className="text-sm text-gray-600">Room {order.deliveryInfo.room}</p>
                          {order.deliveryInfo.landmark && (
                            <p className="text-sm text-gray-600">{order.deliveryInfo.landmark}</p>
                          )}
                        </div>
                      </div>

                      {/* Order Total */}
                      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                        <span className="text-lg font-semibold text-gray-900">Total: ₵{order.total.toFixed(2)}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Confirm Order
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Cancel Order
                            </button>
                          </>
                        )}

                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Start Preparing
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            Mark as Ready
                          </button>
                        )}

                        {order.status === 'ready' && business.delivery.available && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'out-for-delivery')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Out for Delivery
                          </button>
                        )}

                        {(order.status === 'out-for-delivery' || (order.status === 'ready' && !business.delivery.available)) && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Mark as Delivered
                          </button>
                        )}

                        <a
                          href={`tel:${order.customerContact}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call Customer</span>
                        </a>

                        <Link
                          to={`/chat/${order.customerId}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Message</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}