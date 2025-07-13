import React from 'react';
import { Eye, Plus, Edit3, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ProductsCardProps {
  products: Product[];
  onAddNew?: () => void;
  onEdit?: (productId: number) => void;
  onDelete?: (productId: number) => void;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ 
  products, 
  onAddNew, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-600" />
          My Products
        </h3>
        <button 
          onClick={onAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {products.slice(0, 3).map((product) => (
          <div key={product.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-purple-50">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600">${product.price} • {product.stock} in stock</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onEdit?.(product.id)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete?.(product.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsCard;