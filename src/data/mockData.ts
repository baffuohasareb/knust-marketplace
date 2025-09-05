import { Business, Product, Order, Review, ChatConversation, ChatMessage, Notification, OrderUpdate } from '../types';
import type { VendorBusiness, VendorProduct, VendorOrder, BusinessAnalytics } from '../types';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'TechHub Electronics',
    logo: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Latest electronics and accessories for students',
    location: 'Unity Hall',
    rating: 4.8,
    reviewCount: 124,
    phone: '+233241234567',
    whatsapp: '233241234567',
    chatEnabled: true,
    deliveryAvailable: true,
    categories: ['Electronics', 'Accessories'],
    images: [
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    joinedDate: '2023-09-15',
    totalSales: 450,
    responseTime: '< 1 hour',
    isVerified: true
  },
  {
    id: '2',
    name: 'Campus Cuisine',
    logo: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Delicious local and continental dishes',
    location: 'Katanga Hall',
    rating: 4.6,
    reviewCount: 89,
    phone: '+233247654321',
    whatsapp: '233247654321',
    chatEnabled: true,
    deliveryAvailable: true,
    categories: ['Food', 'Beverages'],
    images: [
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    joinedDate: '2023-08-20',
    totalSales: 320,
    responseTime: '< 30 mins',
    isVerified: true
  },
  {
    id: '3',
    name: 'Study Supplies Store',
    logo: 'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'All your academic needs in one place',
    location: 'Queen Elizabeth II Hall',
    rating: 4.7,
    reviewCount: 156,
    phone: '+233201234567',
    chatEnabled: true,
    deliveryAvailable: false,
    categories: ['Stationery', 'Books'],
    images: [
      'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    joinedDate: '2023-07-10',
    totalSales: 280,
    responseTime: '< 2 hours',
    isVerified: false
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    businessId: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones perfect for studying and entertainment',
    price: 150,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    reviewCount: 42,
    options: {
      colors: ['Black', 'White', 'Blue']
    }
  },
  {
    id: '2',
    businessId: '2',
    name: 'Jollof Rice with Chicken',
    description: 'Authentic Ghanaian jollof rice served with grilled chicken',
    price: 25,
    images: [
      'https://images.pexels.com/photos/2233351/pexels-photo-2233351.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'Food',
    stock: 50,
    rating: 4.9,
    reviewCount: 78,
    options: {
      sizes: ['Regular', 'Large']
    }
  },
  {
    id: '3',
    businessId: '3',
    name: 'Engineering Calculator',
    description: 'Scientific calculator suitable for engineering calculations',
    price: 45,
    images: [
      'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'Stationery',
    stock: 15,
    rating: 4.7,
    reviewCount: 23
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    items: [
      {
        productId: '1',
        quantity: 1,
        selectedColor: 'Black',
        price: 150,
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        businessName: 'TechHub Electronics'
      }
    ],
    total: 150,
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    deliveryInfo: {
      hall: 'Unity Hall',
      room: 'A205',
      landmark: 'Near the main entrance'
    },
    paymentMethod: 'MTN Mobile Money',
    deliveryContact: '+233241234567',
    estimatedDelivery: '2024-01-16T15:00:00Z',
    canReview: true,
    trackingUpdates: [
      {
        id: '1',
        status: 'pending',
        message: 'Order placed successfully',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        status: 'confirmed',
        message: 'Order confirmed by seller',
        timestamp: '2024-01-15T11:00:00Z'
      },
      {
        id: '3',
        status: 'preparing',
        message: 'Order is being prepared',
        timestamp: '2024-01-15T12:00:00Z'
      },
      {
        id: '4',
        status: 'out-for-delivery',
        message: 'Order is out for delivery',
        timestamp: '2024-01-16T13:00:00Z',
        location: 'Unity Hall'
      },
      {
        id: '5',
        status: 'delivered',
        message: 'Order delivered successfully',
        timestamp: '2024-01-16T14:20:00Z',
        location: 'Unity Hall - A205'
      }
    ]
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    businessId: '1',
    orderId: 'ORD001',
    rating: 5,
    comment: 'Excellent service! Fast delivery and great quality products. Highly recommend TechHub Electronics.',
    createdAt: '2024-01-17T09:00:00Z',
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    productId: '1',
    businessId: '1',
    rating: 4,
    comment: 'Good headphones for the price. Sound quality is decent and battery life is impressive.',
    createdAt: '2024-01-16T15:30:00Z',
    verified: true,
    helpful: 8
  }
];

export const mockConversations: ChatConversation[] = [
  {
    id: '1',
    buyerId: '1',
    sellerId: '1',
    businessId: '1',
    businessName: 'TechHub Electronics',
    businessLogo: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200',
    unreadCount: 0,
    updatedAt: '2024-01-15T14:30:00Z',
    lastMessage: {
      id: '3',
      senderId: '1',
      senderName: 'TechHub Electronics',
      senderType: 'seller',
      receiverId: '1',
      message: 'Your order has been delivered! Thank you for choosing us.',
      timestamp: '2024-01-15T14:30:00Z',
      read: true,
      type: 'text'
    }
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'John Doe',
    senderType: 'buyer',
    receiverId: '1',
    message: 'Hi, I\'m interested in the Bluetooth headphones. Are they still available?',
    timestamp: '2024-01-15T10:00:00Z',
    read: true,
    type: 'text'
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'TechHub Electronics',
    senderType: 'seller',
    receiverId: '1',
    message: 'Hello! Yes, they are available. We have them in black, white, and blue colors.',
    timestamp: '2024-01-15T10:05:00Z',
    read: true,
    type: 'text'
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'TechHub Electronics',
    senderType: 'seller',
    receiverId: '1',
    message: 'Your order has been delivered! Thank you for choosing us.',
    timestamp: '2024-01-15T14:30:00Z',
    read: true,
    type: 'text'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'order_update',
    title: 'Order Delivered',
    message: 'Your order #ORD001 has been delivered successfully',
    read: false,
    createdAt: '2024-01-16T14:20:00Z',
    actionUrl: '/order/ORD001',
    orderId: 'ORD001'
  },
  {
    id: '2',
    userId: '1',
    type: 'message',
    title: 'New Message',
    message: 'TechHub Electronics sent you a message',
    read: true,
    createdAt: '2024-01-15T14:30:00Z',
    actionUrl: '/chat/1',
    businessId: '1'
  }
];

export const mockUserBusinesses: VendorBusiness[] = [
  {
    id: 'vb1',
    ownerId: '1',
    name: 'Campus Tech Solutions',
    description: 'Laptop repairs, phone accessories, and tech support for students',
    logo: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200',
    businessType: 'both',
    category: 'Electronics & Tech',
    tags: ['laptop repair', 'phone accessories', 'tech support'],
    contactInfo: {
      hall: 'Unity Hall',
      room: 'A205',
      landmark: 'Near the main entrance',
      phone: '+233241234567',
      whatsapp: '233241234567',
    },
    delivery: {
      available: true,
      fee: 5,
      coverage: 'All halls on campus',
    },
    productCount: 15,
    rating: 4.8,
    reviewCount: 42,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  {
    id: 'vb2',
    ownerId: '1',
    name: 'Study Buddy Tutoring',
    description: 'Mathematics and Engineering tutoring services',
    logo: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=200',
    businessType: 'services',
    category: 'Education & Tutoring',
    tags: ['mathematics', 'engineering', 'tutoring'],
    contactInfo: {
      hall: 'Katanga Hall',
      room: 'B102',
      phone: '+233247654321',
      whatsapp: '233247654321',
    },
    delivery: {
      available: false,
    },
    productCount: 0,
    rating: 4.9,
    reviewCount: 28,
    isActive: true,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
];

export const mockVendorProducts: VendorProduct[] = [
  {
    id: 'vp1',
    businessId: 'vb1',
    name: 'Laptop Screen Repair',
    description: 'Professional laptop screen replacement service with 6-month warranty',
    price: 250,
    images: [
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'Electronics & Tech',
    stock: 10,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  {
    id: 'vp2',
    businessId: 'vb1',
    name: 'Phone Case - iPhone 15',
    description: 'Durable protective case for iPhone 15 with shock absorption',
    price: 35,
    images: [
      'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'Electronics & Tech',
    stock: 25,
    isActive: true,
    options: {
      colors: ['Black', 'Clear', 'Blue', 'Red']
    },
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
  },
  {
    id: 'vp3',
    businessId: 'vb2',
    name: 'Mathematics Tutoring - 1 Hour',
    description: 'One-on-one mathematics tutoring session for engineering students',
    price: 20,
    images: [
      'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'Education & Tutoring',
    stock: 50,
    isActive: true,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
  },
];

export const mockVendorOrders: VendorOrder[] = [
  {
    id: 'VO001',
    businessId: 'vb1',
    customerId: '2',
    customerName: 'Jane Smith',
    items: [
      {
        productId: 'vp2',
        quantity: 1,
        selectedColor: 'Black',
        price: 35,
        name: 'Phone Case - iPhone 15',
        image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400',
        businessName: 'Campus Tech Solutions'
      }
    ],
    total: 35,
    status: 'pending',
    createdAt: '2024-01-20T14:30:00Z',
    deliveryInfo: {
      hall: 'Katanga Hall',
      room: 'B205',
      landmark: 'Near the cafeteria'
    },
    paymentMethod: 'MTN Mobile Money',
    customerContact: '+233247654321'
  },
  {
    id: 'VO002',
    businessId: 'vb1',
    customerId: '3',
    customerName: 'Michael Johnson',
    items: [
      {
        productId: 'vp1',
        quantity: 1,
        price: 250,
        name: 'Laptop Screen Repair',
        image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
        businessName: 'Campus Tech Solutions'
      }
    ],
    total: 250,
    status: 'confirmed',
    createdAt: '2024-01-19T11:15:00Z',
    updatedAt: '2024-01-19T12:00:00Z',
    deliveryInfo: {
      hall: 'Unity Hall',
      room: 'A301'
    },
    paymentMethod: 'Vodafone Cash',
    customerContact: '+233201234567'
  }
];

export const mockBusinessAnalytics: BusinessAnalytics = {
  businessId: 'vb1',
  totalOrders: 15,
  totalRevenue: 1250,
  averageOrderValue: 83.33,
  topProducts: [
    {
      productId: 'vp1',
      name: 'Laptop Screen Repair',
      sales: 8,
      revenue: 2000
    },
    {
      productId: 'vp2',
      name: 'Phone Case - iPhone 15',
      sales: 12,
      revenue: 420
    }
  ],
  recentOrders: mockVendorOrders,
  monthlyStats: [
    { month: 'Dec 2023', orders: 5, revenue: 400 },
    { month: 'Jan 2024', orders: 10, revenue: 850 }
  ],
  customerStats: {
    totalCustomers: 12,
    returningCustomers: 3,
    newCustomers: 9
  }
};

export const businessCategories = [
  'Electronics & Tech',
  'Food & Beverages',
  'Fashion & Clothing',
  'Books & Stationery',
  'Health & Beauty',
  'Sports & Fitness',
  'Education & Tutoring',
  'Cleaning & Laundry',
  'Transportation',
  'Entertainment',
  'Other Services',
];

export const knustHalls = [
  'Unity Hall',
  'Katanga Hall',
  'Queen Elizabeth II Hall',
  'Africa Hall',
  'Ghana Hall',
  'Jean Nelson Aka Hall',
  'Liman Hall',
  'Alexander Kwapong Hall',
  'University Hall',
  'Independence Hall',
  'Republic Hall',
  'Brunei Hall',
  'Conti Hall',
  'Off Campus',
];