import React from 'react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface OrderCardProps {
  orderNumber: string;
  title: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  statusColor: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ orderNumber, title, status, statusColor }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{orderNumber}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        {status}
      </span>
    </div>
  );
};

interface StockAlertProps {
  productName: string;
  stock: string;
  alertType: 'Out of Stock' | 'Low Stock';
  alertColor: string;
}

const StockAlert: React.FC<StockAlertProps> = ({ productName, stock, alertType, alertColor }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{productName}</p>
        <p className="text-sm text-gray-600">{stock}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${alertColor}`}>
        {alertType}
      </span>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Products Assigned"
          value="47"
          icon={<Package className="w-6 h-6 text-orange-600" />}
          color="bg-orange-50"
        />
        
        <StatCard
          title="Monthly Sales"
          value="₹2,45,670"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        
        <StatCard
          title="Orders Processed"
          value="342"
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        
        <StatCard
          title="Customers Reached"
          value="1,247"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest orders in your distribution network</p>
          </div>
          
          <div className="space-y-2">
            <OrderCard
              orderNumber="Order #12345"
              title="Handwoven Silk Saree - Mumbai"
              status="Delivered"
              statusColor="bg-green-100 text-green-800"
            />
            <OrderCard
              orderNumber="Order #12346"
              title="Brass Bowl Set - Pune"
              status="In Transit"
              statusColor="bg-blue-100 text-blue-800"
            />
            <OrderCard
              orderNumber="Order #12347"
              title="Ceramic Tea Set - Nashik"
              status="Processing"
              statusColor="bg-yellow-100 text-yellow-800"
            />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            <p className="text-sm text-gray-500">Products that need restocking</p>
          </div>
          
          <div className="space-y-2">
            <StockAlert
              productName="Wooden Jewelry Box"
              stock="0 units remaining"
              alertType="Out of Stock"
              alertColor="bg-red-100 text-red-800"
            />
            <StockAlert
              productName="Brass Decorative Bowl"
              stock="12 units remaining"
              alertType="Low Stock"
              alertColor="bg-yellow-100 text-yellow-800"
            />
            <StockAlert
              productName="Embroidered Wall Hanging"
              stock="8 units remaining"
              alertType="Low Stock"
              alertColor="bg-yellow-100 text-yellow-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
