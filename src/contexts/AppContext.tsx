import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, CartItem, Order, Business, Review, ChatConversation, Notification } from '../types';

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
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
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status']; update?: any } }
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
  favorites: [],
  reviews: [],
  conversations: [],
  notifications: [],
  isAuthenticated: false,
  userBusinesses: [],
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
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload),
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
                  : order.trackingUpdates
              }
            : order
        ),
      };
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.some(fav => fav.id === action.payload.id);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(fav => fav.id !== action.payload.id)
          : [...state.favorites, action.payload],
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
      };
    case 'UPDATE_CONVERSATION':
      const existingConversation = state.conversations.find(conv => conv.id === action.payload.id);
      if (existingConversation) {
        return {
          ...state,
          conversations: state.conversations.map(conv =>
            conv.id === action.payload.id ? action.payload : conv
          ),
        };
      }
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      };
    case 'ADD_USER_BUSINESS':
      return {
        ...state,
        userBusinesses: [...state.userBusinesses, action.payload],
      };
    case 'UPDATE_ONBOARDING_DATA':
      return {
        ...state,
        onboardingData: {
          ...state.onboardingData,
          ...action.payload,
        },
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
  const [state, dispatch] = useReducer(appReducer, initialState);

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