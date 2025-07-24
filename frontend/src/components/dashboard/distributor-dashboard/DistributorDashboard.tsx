import React from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, PlusCircle, MoreVertical } from 'lucide-react';

// Interfaces for type safety
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const DistributorDashboard: React.FC = () => {
  // Mock data - to be replaced with API calls
  const stats: StatCardProps[] = [
    { title: 'Total Products', value: '128', icon: Package, color: 'bg-blue-500' },
    { title: 'Pending Orders', value: '12', icon: ShoppingCart, color: 'bg-yellow-500' },
    { title: 'Monthly Sales', value: '350', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Total Revenue', value: '₹85,230', icon: DollarSign, color: 'bg-purple-500' },
  ];

  const recentOrders: Order[] = [
    { id: 'ORD-001', customerName: 'Rohan Sharma', date: '2025-07-24', amount: 1250, status: 'Shipped' },
    { id: 'ORD-002', customerName: 'Priya Patel', date: '2025-07-23', amount: 850, status: 'Delivered' },
    { id: 'ORD-003', customerName: 'Amit Kumar', date: '2025-07-23', amount: 2100, status: 'Pending' },
    { id: 'ORD-004', customerName: 'Sneha Verma', date: '2025-07-22', amount: 500, status: 'Delivered' },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Welcome back! Here's your business overview.</p>
          </div>
          <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;