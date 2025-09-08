import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { User, CartItem, Order, Business, Review, ChatConversation, Notification, VendorBusiness, OnboardingData, VendorOrder } from '../types';
import { mockUserBusinesses } from '../data/mockData';

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  vendorOrders: VendorOrder[];
  favorites: Business[];
  reviews: Review[];
  conversations: ChatConversation[];
  notifications: Notification[];
  isAuthenticated: boolean;
  userBusinesses: VendorBusiness[];
  onboardingData: OnboardingData;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'ADD_VENDOR_ORDERS'; payload: VendorOrder[] }
  | { type: 'UPDATE_VENDOR_ORDER_STATUS'; payload: { orderId: string; status: VendorOrder['status'] } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status']; update?: any } }
  | { type: 'CLEAR_ALL_ORDERS' }
  | { type: 'TOGGLE_FAVORITE'; payload: Business }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'UPDATE_CONVERSATION'; payload: ChatConversation }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_USER_BUSINESS'; payload: VendorBusiness }
  | { type: 'UPDATE_ONBOARDING_DATA'; payload: Partial<OnboardingData> }
  | { type: 'CLEAR_ONBOARDING_DATA' };

const initialState: AppState = {
  user: null,
  cart: [],
  orders: [],
  vendorOrders: [],
  favorites: [],
  reviews: [],
  conversations: [],
  notifications: [],
  isAuthenticated: false,
  // Seed demo vendor businesses so every logged-in account sees labeled businesses
  userBusinesses: mockUserBusinesses,
  onboardingData: {
    businessType: '',
    businessInfo: {
      name: '',
      description: '',
      category: '',
      tags: [],
      logo: null,
    },
    contactInfo: {
      hall: '',
      room: '',
      landmark: '',
      phone: '',
      whatsapp: '',
    },
    delivery: {
      available: false,
      fee: 0,
      coverage: '',
    },
  },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };

    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item =>
        item.productId === action.payload.productId &&
        item.selectedSize === action.payload.selectedSize &&
        item.selectedColor === action.payload.selectedColor
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId &&
            item.selectedSize === action.payload.selectedSize &&
            item.selectedColor === action.payload.selectedColor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    case 'ADD_VENDOR_ORDERS':
      return {
        ...state,
        vendorOrders: [...action.payload, ...state.vendorOrders],
      };
    case 'UPDATE_VENDOR_ORDER_STATUS':
      return {
        ...state,
        vendorOrders: state.vendorOrders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date().toISOString() }
            : order
        ),
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? {
                ...order,
                status: action.payload.status,
                updatedAt: new Date().toISOString(),
                trackingUpdates: action.payload.update
                  ? [...(order.trackingUpdates || []), action.payload.update]
                  : order.trackingUpdates,
              }
            : order
        ),
      };
    case 'CLEAR_ALL_ORDERS':
      return {
        ...state,
        orders: [],
        vendorOrders: [],
      };
    case 'CLEAR_ONBOARDING_DATA':
      return {
        ...state,
        onboardingData: initialState.onboardingData,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [state, dispatch] = useReducer(appReducer, undefined as any, () => {
    try {
      const raw = localStorage.getItem('knust_marketplace_app_state');
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        return {
          ...initialState,
          ...parsed,
          // Ensure required demo businesses are present for showcasing
          userBusinesses: parsed.userBusinesses && parsed.userBusinesses.length > 0 ? parsed.userBusinesses : initialState.userBusinesses,
        } as AppState;
      }
    } catch (e) {
      console.warn('Failed to parse saved state. Using defaults.', e);
    }
    return initialState;
  });

  // Persist state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('knust_marketplace_app_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist state', e);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}