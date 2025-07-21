export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Artisan' | 'Distributor' | 'General User';
  status: 'Active' | 'Banned' | 'Pending';
  verified: boolean;
  joinDate: string;
  lastActive: string;
  avatar?: string;
  totalOrders?: number;
  totalSpent?: number;
  productsListed?: number;
}

export interface Product {
  id: string;
  name: string;
  artisanId: string;
  artisanName: string;
  category: string;
  price: number;
  stock: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Flagged';
  dateAdded: string;
  image: string;
  description: string;
  reported: boolean;
  reportCount: number;
  sales: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerRole: 'Artisan' | 'Distributor' | 'General User';
  artisanId: string;
  artisanName: string;
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  deliveryDate?: string;
}

export interface Report {
  id: string;
  type: 'Product' | 'User' | 'Order';
  targetId: string;
  targetName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'New' | 'In Progress' | 'Resolved';
  dateReported: string;
  resolvedDate?: string;
  resolvedBy?: string;
}

export interface Notification {
  id: string;
  type: 'signup' | 'product' | 'order' | 'report' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Analytics {
  totalUsers: {
    artisans: number;
    distributors: number;
    general: number;
  };
  products: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  orders: {
    thisWeek: number;
    totalRevenue: number;
    processing: number;
    completed: number;
  };
  topArtisan: {
    name: string;
    sales: number;
  };
  topProduct: {
    name: string;
    sales: number;
  };
}