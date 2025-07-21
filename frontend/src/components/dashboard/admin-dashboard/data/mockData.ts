import { User, Product, Order, Report, Notification, Analytics } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Maya Patel',
    email: 'maya@example.com',
    role: 'Artisan',
    status: 'Active',
    verified: true,
    joinDate: '2024-01-15',
    lastActive: '2024-01-20',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    productsListed: 12,
    totalOrders: 45
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'Distributor',
    status: 'Active',
    verified: true,
    joinDate: '2024-01-10',
    lastActive: '2024-01-20',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    totalOrders: 23,
    totalSpent: 15600
  },
  {
    id: '3',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'General User',
    status: 'Active',
    verified: false,
    joinDate: '2024-01-18',
    lastActive: '2024-01-19',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    totalOrders: 8,
    totalSpent: 320
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david@example.com',
    role: 'Artisan',
    status: 'Pending',
    verified: false,
    joinDate: '2024-01-19',
    lastActive: '2024-01-20',
    productsListed: 3,
    totalOrders: 0
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Silk Scarf',
    artisanId: '1',
    artisanName: 'Maya Patel',
    category: 'Textiles',
    price: 89.99,
    stock: 15,
    status: 'Approved',
    dateAdded: '2024-01-15',
    image: 'https://images.pexels.com/photos/6069064/pexels-photo-6069064.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    description: 'Beautiful handwoven silk scarf with traditional patterns',
    reported: false,
    reportCount: 0,
    sales: 23
  },
  {
    id: '2',
    name: 'Ceramic Coffee Mug Set',
    artisanId: '4',
    artisanName: 'David Rodriguez',
    category: 'Ceramics',
    price: 45.00,
    stock: 8,
    status: 'Pending',
    dateAdded: '2024-01-19',
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    description: 'Set of 4 handcrafted ceramic mugs',
    reported: false,
    reportCount: 0,
    sales: 0
  },
  {
    id: '3',
    name: 'Leather Wallet',
    artisanId: '1',
    artisanName: 'Maya Patel',
    category: 'Leather Goods',
    price: 65.00,
    stock: 0,
    status: 'Flagged',
    dateAdded: '2024-01-10',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    description: 'Handcrafted leather wallet with multiple compartments',
    reported: true,
    reportCount: 2,
    sales: 12
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    buyerId: '2',
    buyerName: 'James Wilson',
    buyerRole: 'Distributor',
    artisanId: '1',
    artisanName: 'Maya Patel',
    productId: '1',
    productName: 'Handwoven Silk Scarf',
    quantity: 10,
    amount: 899.90,
    status: 'Processing',
    orderDate: '2024-01-20',
  },
  {
    id: '2',
    buyerId: '3',
    buyerName: 'Sarah Chen',
    buyerRole: 'General User',
    artisanId: '1',
    artisanName: 'Maya Patel',
    productId: '1',
    productName: 'Handwoven Silk Scarf',
    quantity: 1,
    amount: 89.99,
    status: 'Delivered',
    orderDate: '2024-01-18',
    deliveryDate: '2024-01-20'
  },
  {
    id: '3',
    buyerId: '4',
    buyerName: 'David Rodriguez',
    buyerRole: 'Artisan',
    artisanId: '1',
    artisanName: 'Maya Patel',
    productId: '2',
    productName: 'Raw Material Kit - Cotton Threads',
    quantity: 5,
    amount: 225.00,
    status: 'Shipped',
    orderDate: '2024-01-19',
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'Product',
    targetId: '3',
    targetName: 'Leather Wallet',
    reporterId: '3',
    reporterName: 'Sarah Chen',
    reason: 'Quality Issues',
    description: 'Product quality does not match description',
    status: 'New',
    dateReported: '2024-01-20'
  },
  {
    id: '2',
    type: 'User',
    targetId: '4',
    targetName: 'David Rodriguez',
    reporterId: '2',
    reporterName: 'James Wilson',
    reason: 'Fraudulent Activity',
    description: 'Suspicious account activity detected',
    status: 'In Progress',
    dateReported: '2024-01-19'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'signup',
    title: 'New User Registration',
    message: 'David Rodriguez registered as Artisan',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: '2',
    type: 'product',
    title: 'Product Reported',
    message: 'Leather Wallet has been reported by Sarah Chen',
    timestamp: '2024-01-20T09:15:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'order',
    title: 'Large Order Placed',
    message: 'James Wilson placed order for 10 Handwoven Silk Scarfs',
    timestamp: '2024-01-20T08:45:00Z',
    read: true,
    priority: 'medium'
  }
];

export const mockAnalytics: Analytics = {
  totalUsers: {
    artisans: 142,
    distributors: 38,
    general: 1247
  },
  products: {
    total: 356,
    pending: 23,
    approved: 298,
    rejected: 35
  },
  orders: {
    thisWeek: 87,
    totalRevenue: 45632,
    processing: 15,
    completed: 423
  },
  topArtisan: {
    name: 'Maya Patel',
    sales: 89
  },
  topProduct: {
    name: 'Handwoven Silk Scarf',
    sales: 156
  }
};