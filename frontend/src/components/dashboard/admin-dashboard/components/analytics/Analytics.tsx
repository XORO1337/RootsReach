import React from 'react';
import { mockAnalytics } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { Users, Package, ShoppingCart, TrendingUp, Trophy, Star } from 'lucide-react';

const Analytics: React.FC = () => {
  const analytics = mockAnalytics;

  const chartData = [
    { name: 'Jan', orders: 45, revenue: 12000 },
    { name: 'Feb', orders: 52, revenue: 15000 },
    { name: 'Mar', orders: 48, revenue: 13500 },
    { name: 'Apr', orders: 67, revenue: 18000 },
    { name: 'May', orders: 71, revenue: 19500 },
    { name: 'Jun', orders: 82, revenue: 22000 },
  ];

  const userGrowth = [
    { month: 'Jan', artisans: 120, distributors: 30, general: 1100 },
    { month: 'Feb', artisans: 125, distributors: 32, general: 1150 },
    { month: 'Mar', artisans: 130, distributors: 34, general: 1180 },
    { month: 'Apr', artisans: 135, distributors: 36, general: 1200 },
    { month: 'May', artisans: 140, distributors: 37, general: 1230 },
    { month: 'Jun', artisans: 142, distributors: 38, general: 1247 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalUsers.artisans + analytics.totalUsers.distributors + analytics.totalUsers.general}
              </p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.products.total}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orders This Week</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders.thisWeek}</p>
              <p className="text-sm text-green-600">+23% from last week</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.orders.totalRevenue)}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Artisans</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{analytics.totalUsers.artisans}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.totalUsers.artisans / (analytics.totalUsers.artisans + analytics.totalUsers.distributors + analytics.totalUsers.general)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Distributors</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{analytics.totalUsers.distributors}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.totalUsers.distributors / (analytics.totalUsers.artisans + analytics.totalUsers.distributors + analytics.totalUsers.general)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">General Users</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{analytics.totalUsers.general}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.totalUsers.general / (analytics.totalUsers.artisans + analytics.totalUsers.distributors + analytics.totalUsers.general)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{analytics.products.approved}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.products.approved / analytics.products.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{analytics.products.pending}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.products.pending / analytics.products.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{analytics.products.rejected}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.products.rejected / analytics.products.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
        <div className="h-64 flex items-end space-x-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                <div 
                  className="bg-blue-500 rounded-t-lg absolute bottom-0 w-full transition-all duration-300"
                  style={{ height: `${(item.revenue / 25000) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{item.name}</div>
              <div className="text-xs font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Artisan</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{analytics.topArtisan.name}</p>
              <p className="text-sm text-gray-600">{analytics.topArtisan.sales} sales this month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Product</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{analytics.topProduct.name}</p>
              <p className="text-sm text-gray-600">{analytics.topProduct.sales} units sold</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;