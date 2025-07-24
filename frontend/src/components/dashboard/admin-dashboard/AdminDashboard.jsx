import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, TrendingUp, Settings, Bell, Search, MoreHorizontal } from 'lucide-react';
import { adminAPI } from '../../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', change: '+0%', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Products', value: '0', change: '+0%', icon: Package, color: 'bg-green-500' },
    { title: 'Total Orders', value: '0', change: '+0%', icon: ShoppingBag, color: 'bg-purple-500' },
    { title: 'Revenue', value: '₹0', change: '+0%', icon: TrendingUp, color: 'bg-orange-500' },
  ]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats
        const statsResponse = await adminAPI.getStats();
        if (statsResponse.success) {
          const data = statsResponse.data;
          setStats([
            { 
              title: 'Total Users', 
              value: data.totalUsers?.toString() || '0', 
              change: data.growth?.users || '+0%', 
              icon: Users, 
              color: 'bg-blue-500' 
            },
            { 
              title: 'Total Products', 
              value: data.totalProducts?.toString() || '0', 
              change: data.growth?.products || '+0%', 
              icon: Package, 
              color: 'bg-green-500' 
            },
            { 
              title: 'Total Orders', 
              value: data.totalOrders?.toString() || '0', 
              change: data.growth?.orders || '+0%', 
              icon: ShoppingBag, 
              color: 'bg-purple-500' 
            },
            { 
              title: 'Revenue', 
              value: `₹${data.totalRevenue?.toLocaleString() || '0'}`, 
              change: data.growth?.revenue || '+0%', 
              icon: TrendingUp, 
              color: 'bg-orange-500' 
            },
          ]);
        }

        // Fetch recent users
        const usersResponse = await adminAPI.getRecentUsers();
        if (usersResponse.success && usersResponse.data) {
          // Format user data for display
          const formattedUsers = usersResponse.data.map(user => ({
            id: user._id || user.id,
            name: user.name || user.fullName || 'N/A',
            email: user.email || 'N/A',
            role: user.role || 'user',
            status: user.isActive ? 'Active' : 'Inactive',
            joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
          }));
          setRecentUsers(formattedUsers);
        }

        // Fetch recent orders
        const ordersResponse = await adminAPI.getRecentOrders();
        if (ordersResponse.success && ordersResponse.data) {
          setRecentOrders(ordersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        // Set fallback data on error
        setStats([
          { title: 'Total Users', value: 'N/A', change: 'N/A', icon: Users, color: 'bg-blue-500' },
          { title: 'Total Products', value: 'N/A', change: 'N/A', icon: Package, color: 'bg-green-500' },
          { title: 'Total Orders', value: 'N/A', change: 'N/A', icon: ShoppingBag, color: 'bg-purple-500' },
          { title: 'Revenue', value: 'N/A', change: 'N/A', icon: TrendingUp, color: 'bg-orange-500' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'users', name: 'Users' },
    { id: 'products', name: 'Products' },
    { id: 'orders', name: 'Orders' },
    { id: 'settings', name: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="flex items-center">
                      <div className="bg-gray-300 rounded-lg p-3 w-12 h-12"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className={`${stat.color} rounded-lg p-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton for table
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-300 rounded animate-pulse w-8"></div>
                          </td>
                        </tr>
                      ))
                    ) : recentUsers.length > 0 ? (
                      recentUsers.map((user, index) => (
                        <tr key={user.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No recent users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h2>
            <p className="text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.name} management features coming soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;