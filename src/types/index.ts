export interface User {
  id: string;
  name: string;
  email: string;
  indexNumber: string;
  programme: string;
  year: number;
  hall?: string;
}

export interface Business {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  whatsapp?: string;
  chatEnabled: boolean;
  deliveryAvailable: boolean;
  categories: string[];
  images: string[];
  isFavorite?: boolean;
  joinedDate?: string;
  totalSales?: number;
  responseTime?: string;
  isVerified?: boolean;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  options?: {
    sizes?: string[];
    colors?: string[];
  };
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price: number;
  name: string;
  image: string;
  businessName: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  deliveryInfo: {
    hall: string;
    room: string;
    landmark?: string;
  };
  paymentMethod: string;
  deliveryContact?: string;
  estimatedDelivery?: string;
  trackingUpdates?: OrderUpdate[];
  canReview?: boolean;
}

export interface OrderUpdate {
  id: string;
  status: Order['status'];
  message: string;
  timestamp: string;
  location?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId?: string;
  businessId?: string;
  orderId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
  helpful?: number;
  images?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'buyer' | 'seller';
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'order' | 'system';
  orderId?: string;
  imageUrl?: string;
}

export interface ChatConversation {
  id: string;
  buyerId: string;
  sellerId: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_update' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  orderId?: string;
  businessId?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  businessId: string;
  businessName: string;
  orderId?: string;
  type: 'false_advertising' | 'poor_service' | 'delayed_delivery' | 'quality_issues' | 'inappropriate_behavior' | 'other';
  description: string;
  evidence?: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  adminResponse?: string;
}

export interface VendorBusiness {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  businessType: 'goods' | 'services' | 'both';
  category: string;
  tags: string[];
  contactInfo: {
    hall: string;
    room: string;
    landmark?: string;
    phone: string;
    whatsapp?: string;
  };
  delivery: {
    available: boolean;
    fee?: number;
    coverage?: string;
  };
  productCount: number;
  rating?: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  businessType: 'goods' | 'services' | 'both' | '';
  businessInfo: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    logo: File | null;
  };
  contactInfo: {
    hall: string;
    room: string;
    landmark: string;
    phone: string;
    whatsapp: string;
  };
  delivery: {
    available: boolean;
    fee: number;
    coverage: string;
  };
}