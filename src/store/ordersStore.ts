import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, VendorOrder } from '../types';

interface OrdersState {
  orders: Order[];
  vendorOrders: VendorOrder[];
  addOrder: (order: Order) => void;
  addVendorOrders: (orders: VendorOrder[]) => void;
  updateVendorOrderStatus: (orderId: string, status: VendorOrder['status']) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], update?: Partial<Order>) => void;
  clearOrders: () => void;
  clearVendorOrders: () => void;
  clearAll: () => void;
}

const storeImpl: StateCreator<
  OrdersState,
  [],
  [['zustand/persist', OrdersState]]
> = (set, get) => ({
  orders: [],
  vendorOrders: [],
  addOrder: (order: Order) => set({ orders: [order, ...get().orders] }),
  addVendorOrders: (orders: VendorOrder[]) => set({ vendorOrders: [...orders, ...get().vendorOrders] }),
  updateVendorOrderStatus: (orderId: string, status: VendorOrder['status']) =>
    set({
      vendorOrders: get().vendorOrders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }),
  updateOrderStatus: (orderId, status, update) =>
    set({
      orders: get().orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: status as any,
              updatedAt: new Date().toISOString(),
              trackingUpdates: update && (update as any).trackingUpdates
                ? [...(o.trackingUpdates || []), ...(update as any).trackingUpdates]
                : o.trackingUpdates,
            }
          : o
      ),
    }),
  clearOrders: () => set({ orders: [] }),
  clearVendorOrders: () => set({ vendorOrders: [] }),
  clearAll: () => set({ orders: [], vendorOrders: [] }),
});

export const useOrdersStore = create<OrdersState>()(
  persist(storeImpl, { name: 'km_orders_store' })
);
