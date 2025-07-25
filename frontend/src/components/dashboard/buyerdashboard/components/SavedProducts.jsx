import React from 'react';
import { Bookmark, Clock, Filter } from 'lucide-react';

const SavedProducts = ({ savedProducts, onRemoveSaved }) => {
  const categories = ['All', 'Jewelry', 'Textiles', 'Pottery', 'Accessories'];

  if (savedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved products</h3>
        <p className="text-gray-600 mb-4">Products you save for later will appear here</p>
        <button className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors">
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Saved Products ({savedProducts.length})
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button className="text-rose-600 hover:text-rose-700 font-medium text-sm">
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {savedProducts.map((product) => (
            <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600">by {product.artisan}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    Saved {product.savedDate}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium">
                  Add to Cart
                </button>
                <button 
                  onClick={() => onRemoveSaved?.(product.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedProducts;