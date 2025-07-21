import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, Package, ShoppingCart } from 'lucide-react';

const DataExport: React.FC = () => {
  const [selectedExport, setSelectedExport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState('csv');

  const exportOptions = [
    {
      id: 'users',
      title: 'User Data',
      description: 'Export user information, roles, and activity data',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'products',
      title: 'Product Data',
      description: 'Export product listings, status, and performance metrics',
      icon: Package,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'orders',
      title: 'Order Data',
      description: 'Export order history, transactions, and fulfillment data',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'reports',
      title: 'Reports & Feedback',
      description: 'Export user reports, feedback, and moderation actions',
      icon: FileText,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const handleExport = () => {
    if (!selectedExport) return;

    // Simulate export process
    const filename = `${selectedExport}_export_${new Date().toISOString().split('T')[0]}.${format}`;
    
    // In a real implementation, this would trigger the actual export
    console.log(`Exporting ${selectedExport} data as ${format} format`);
    console.log(`Date range: ${dateRange.start} to ${dateRange.end}`);
    console.log(`Filename: ${filename}`);
    
    // Simulate download
    alert(`Export started! File will be downloaded as: ${filename}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Export</h2>
        <p className="text-gray-600">Export platform data for analysis, backup, or compliance purposes.</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.id}
              onClick={() => setSelectedExport(option.id)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedExport === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${option.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Configuration */}
      {selectedExport && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Export Configuration</h3>
          
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="csv">CSV (Comma Separated Values)</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="json">JSON (JavaScript Object Notation)</option>
              <option value="pdf">PDF (Portable Document Format)</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Recent Exports */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h3>
        <div className="space-y-3">
          {[
            { name: 'users_export_2024-01-20.csv', size: '2.3 MB', date: '2024-01-20', type: 'Users' },
            { name: 'products_export_2024-01-19.xlsx', size: '5.7 MB', date: '2024-01-19', type: 'Products' },
            { name: 'orders_export_2024-01-18.json', size: '1.8 MB', date: '2024-01-18', type: 'Orders' },
          ].map((export_, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{export_.name}</p>
                  <p className="text-xs text-gray-500">{export_.type} • {export_.size} • {export_.date}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataExport;