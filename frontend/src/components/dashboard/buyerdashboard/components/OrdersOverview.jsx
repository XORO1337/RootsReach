import React from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';

const OrdersOverview = ({ orders }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <button className="text-rose-600 hover:text-rose-700 font-medium">
            View All Orders
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.productName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{order.productName}</h3>
                  <p className="text-sm text-gray-600">by {order.artisan}</p>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {order.status === 'delivered' && (
                  <span className="text-green-600">✓ Delivered on {order.deliveredDate}</span>
                )}
                {order.status === 'shipped' && (
                  <span className="text-blue-600">Expected delivery: {order.expectedDate}</span>
                )}
                {order.status === 'processing' && (
                  <span className="text-yellow-600">Being prepared for shipment</span>
                )}
              </div>
              <button className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 text-sm font-medium">
                <Eye size={16} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersOverview;