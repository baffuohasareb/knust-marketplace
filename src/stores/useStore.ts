import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  CartItem,
  Order,
  Business,
  Review,
  ChatConversation,
  Notification,
  VendorBusiness,
  VendorProduct,
  VendorOrder,
  OnboardingData,
} from "../types";

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Shopping state
  cart: CartItem[];
  orders: Order[];
  favorites: Business[];

  // Reviews and social
  reviews: Review[];
  conversations: ChatConversation[];
  notifications: Notification[];

  // Vendor state
  userBusinesses: VendorBusiness[];
  vendorProducts: VendorProduct[];
  vendorOrders: VendorOrder[];
  onboardingData: OnboardingData;

  // Global data
  businesses: Business[];
  products: Business[];
}

interface AppActions {
  // User actions
  login: (user: User) => void;
  logout: () => void;

  // Cart actions
  addToCart: (item: CartItem) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Order actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
    update?: any
  ) => void;

  // Favorites actions
  toggleFavorite: (business: Business) => void;

  // Review actions
  addReview: (review: Review) => void;

  // Conversation actions
  updateConversation: (conversation: ChatConversation) => void;
  addConversation: (conversation: ChatConversation) => void;
  deleteConversation: (conversationId: string) => void;
  markConversationAsRead: (conversationId: string) => void;

  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Vendor actions
  addUserBusiness: (business: VendorBusiness) => void;
  updateUserBusiness: (
    businessId: string,
    updates: Partial<VendorBusiness>
  ) => void;
  addVendorProduct: (product: VendorProduct) => void;
  updateVendorProduct: (
    productId: string,
    updates: Partial<VendorProduct>
  ) => void;
  deleteVendorProduct: (productId: string) => void;
  addVendorOrder: (order: VendorOrder) => void;
  updateVendorOrder: (orderId: string, updates: Partial<VendorOrder>) => void;

  // Onboarding actions
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  clearOnboardingData: () => void;

  // Global data actions
  setBusinesses: (businesses: Business[]) => void;
  setProducts: (products: Business[]) => void;
}

export const useStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      cart: [],
      orders: [],
      favorites: [],
      reviews: [],
      conversations: [],
      notifications: [],
      userBusinesses: [],
      vendorProducts: [],
      vendorOrders: [],
      onboardingData: {
        businessType: "",
        businessInfo: {
          name: "",
          description: "",
          category: "",
          tags: [],
          logo: null,
        },
        contactInfo: {
          hall: "",
          room: "",
          landmark: "",
          phone: "",
          whatsapp: "",
        },
        delivery: {
          available: false,
          fee: 0,
          coverage: "",
        },
      },
      businesses: [],
      products: [],

      // User actions
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          cart: [],
          orders: [],
          favorites: [],
          reviews: [],
          conversations: [],
          notifications: [],
          userBusinesses: [],
          vendorProducts: [],
          vendorOrders: [],
          onboardingData: {
            businessType: "",
            businessInfo: {
              name: "",
              description: "",
              category: "",
              tags: [],
              logo: null,
            },
            contactInfo: {
              hall: "",
              room: "",
              landmark: "",
              phone: "",
              whatsapp: "",
            },
            delivery: {
              available: false,
              fee: 0,
              coverage: "",
            },
          },
        }),

      // Cart actions
      addToCart: (item: CartItem) => {
        const { cart } = get();
        const existingItem = cart.find(
          (cartItem) =>
            cartItem.productId === item.productId &&
            cartItem.selectedSize === item.selectedSize &&
            cartItem.selectedColor === item.selectedColor
        );

        if (existingItem) {
          set({
            cart: cart.map((cartItem) =>
              cartItem.productId === item.productId &&
              cartItem.selectedSize === item.selectedSize &&
              cartItem.selectedColor === item.selectedColor
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      updateCartItem: (productId: string, quantity: number) => {
        const { cart } = get();
        set({
          cart: cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      removeFromCart: (productId: string) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.productId !== productId) });
      },

      clearCart: () => set({ cart: [] }),

      // Order actions
      addOrder: (order: Order) => {
        const { orders } = get();
        set({ orders: [order, ...orders] });
      },

      updateOrderStatus: (
        orderId: string,
        status: Order["status"],
        update?: any
      ) => {
        const { orders } = get();
        set({
          orders: orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date().toISOString(),
                  trackingUpdates: update
                    ? [...(order.trackingUpdates || []), update]
                    : order.trackingUpdates,
                }
              : order
          ),
        });
      },

      // Favorites actions
      toggleFavorite: (business: Business) => {
        const { favorites } = get();
        const isFavorite = favorites.some((fav) => fav.id === business.id);
        set({
          favorites: isFavorite
            ? favorites.filter((fav) => fav.id !== business.id)
            : [...favorites, business],
        });
      },

      // Review actions
      addReview: (review: Review) => {
        const { reviews } = get();
        set({ reviews: [review, ...reviews] });
      },

      // Conversation actions
      updateConversation: (conversation: ChatConversation) => {
        const { conversations } = get();
        const existingConversation = conversations.find(
          (conv) => conv.id === conversation.id
        );
        if (existingConversation) {
          set({
            conversations: conversations.map((conv) =>
              conv.id === conversation.id ? conversation : conv
            ),
          });
        } else {
          set({ conversations: [conversation, ...conversations] });
        }
      },

      addConversation: (conversation: ChatConversation) => {
        const { conversations } = get();
        const existingConversation = conversations.find(
          (conv) => conv.id === conversation.id
        );
        if (!existingConversation) {
          set({ conversations: [conversation, ...conversations] });
        }
      },

      deleteConversation: (conversationId: string) => {
        const { conversations } = get();
        set({
          conversations: conversations.filter(
            (conv) => conv.id !== conversationId
          ),
        });
      },

      markConversationAsRead: (conversationId: string) => {
        const { conversations } = get();
        set({
          conversations: conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  unreadCount: 0,
                  lastMessage: conv.lastMessage
                    ? { ...conv.lastMessage, read: true }
                    : undefined,
                }
              : conv
          ),
        });
      },

      // Notification actions
      addNotification: (notification: Notification) => {
        const { notifications } = get();
        set({ notifications: [notification, ...notifications] });
      },

      markNotificationRead: (notificationId: string) => {
        const { notifications } = get();
        set({
          notifications: notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
        });
      },

      markAllNotificationsRead: () => {
        const { notifications } = get();
        set({
          notifications: notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        });
      },

      // Vendor actions
      addUserBusiness: (business: VendorBusiness) => {
        const { userBusinesses } = get();
        set({ userBusinesses: [...userBusinesses, business] });
      },

      updateUserBusiness: (
        businessId: string,
        updates: Partial<VendorBusiness>
      ) => {
        const { userBusinesses } = get();
        set({
          userBusinesses: userBusinesses.map((business) =>
            business.id === businessId ? { ...business, ...updates } : business
          ),
        });
      },

      addVendorProduct: (product: VendorProduct) => {
        const { vendorProducts } = get();
        set({ vendorProducts: [...vendorProducts, product] });
      },

      updateVendorProduct: (
        productId: string,
        updates: Partial<VendorProduct>
      ) => {
        const { vendorProducts } = get();
        set({
          vendorProducts: vendorProducts.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        });
      },

      deleteVendorProduct: (productId: string) => {
        const { vendorProducts } = get();
        set({
          vendorProducts: vendorProducts.filter(
            (product) => product.id !== productId
          ),
        });
      },

      addVendorOrder: (order: VendorOrder) => {
        const { vendorOrders } = get();
        set({ vendorOrders: [order, ...vendorOrders] });
      },

      updateVendorOrder: (orderId: string, updates: Partial<VendorOrder>) => {
        const { vendorOrders } = get();
        set({
          vendorOrders: vendorOrders.map((order) =>
            order.id === orderId ? { ...order, ...updates } : order
          ),
        });
      },

      // Onboarding actions
      updateOnboardingData: (data: Partial<OnboardingData>) => {
        const { onboardingData } = get();
        set({ onboardingData: { ...onboardingData, ...data } });
      },

      clearOnboardingData: () => {
        set({
          onboardingData: {
            businessType: "",
            businessInfo: {
              name: "",
              description: "",
              category: "",
              tags: [],
              logo: null,
            },
            contactInfo: {
              hall: "",
              room: "",
              landmark: "",
              phone: "",
              whatsapp: "",
            },
            delivery: {
              available: false,
              fee: 0,
              coverage: "",
            },
          },
        });
      },

      // Global data actions
      setBusinesses: (businesses: Business[]) => set({ businesses }),
      setProducts: (products: Business[]) => set({ products }),
    }),
    {
      name: "knust-marketplace-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        orders: state.orders,
        favorites: state.favorites,
        reviews: state.reviews,
        conversations: state.conversations,
        notifications: state.notifications,
        userBusinesses: state.userBusinesses,
        vendorProducts: state.vendorProducts,
        vendorOrders: state.vendorOrders,
        onboardingData: state.onboardingData,
      }),
    }
  )
);
