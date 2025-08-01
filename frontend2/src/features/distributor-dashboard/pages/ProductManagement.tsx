import React, { useState } from 'react';
import { Search, MoreHorizontal, Package, AlertCircle, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  artisan: string;
  price: number;
  stock: number;
  minStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  region: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Silk Saree',
    category: 'Textiles',
    artisan: 'Sunita Devi',
    price: 1500,
    stock: 46,
    minStock: 20,
    status: 'In Stock',
    region: 'Maharashtra'
  },
  {
    id: '2',
    name: 'Brass Decorative Bowl',
    category: 'Home Decor',
    artisan: 'Rajesh Kumar',
    price: 850,
    stock: 12,
    minStock: 15,
    status: 'Low Stock',
    region: 'Rajasthan'
  },
  {
    id: '3',
    name: 'Wooden Jewelry Box',
    category: 'Accessories',
    artisan: 'Amit Patel',
    price: 650,
    stock: 0,
    minStock: 10,
    status: 'Out of Stock',
    region: 'Gujarat'
  },
  {
    id: '4',
    name: 'Ceramic Tea Set',
    category: 'Kitchenware',
    artisan: 'Priya Sharma',
    price: 1200,
    stock: 28,
    minStock: 15,
    status: 'In Stock',
    region: 'Karnataka'
  },
  {
    id: '5',
    name: 'Embroidered Wall Hanging',
    category: 'Art',
    artisan: 'Vikram Singh',
    price: 950,
    stock: 8,
    minStock: 12,
    status: 'Low Stock',
    region: 'Punjab'
  }
];

const ProductManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Low Stock':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Out of Stock':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const totalProducts = products.length;
  const inStock = products.filter(p => p.status === 'In Stock').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Management</h2>
        <p className="text-gray-600">Manage your assigned products and inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Package className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{inStock}</p>
          <p className="text-sm text-gray-600">In Stock</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
          <p className="text-sm text-gray-600">Low Stock</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
          <p className="text-sm text-gray-600">Out of Stock</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Assigned Products</h3>
            <p className="text-sm text-gray-500">Products assigned to your distribution region</p>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.artisan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.stock}
                      <span className="text-gray-500 ml-1">/ Min: {product.minStock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(product.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
