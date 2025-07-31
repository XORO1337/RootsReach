import React, { useState, useEffect } from 'react';
import { PackagePlus, Plus, Minus, X, Loader2, AlertCircle } from 'lucide-react';
import { RawMaterial } from './types'; // 🔁 adjust path if needed
import { useAuth } from '../../Auth/AuthContext';

interface RawMaterialsProps {
  onOrderMore?: () => void;
}

// 🖼️ Image Modal Component
const ImageModal: React.FC<{
  image: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ image, name, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-4 max-w-2xl max-h-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <img src={image} alt={name} className="w-full h-auto rounded-lg" />
      </div>
    </div>
  );
};

const RawMaterials: React.FC<RawMaterialsProps> = ({ onOrderMore }) => {
  // 🏗️ State Management
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ image: string; name: string } | null>(null);
  const [updatingMaterials, setUpdatingMaterials] = useState<Set<number>>(new Set());

  // 🔄 Fetch Raw Materials from Backend
  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🌐 Make API call to backend
      const response = await fetch('/api/materials', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials. Please try again.');
      
      // 🔄 Fallback to mock data for development
      const mockMaterials: RawMaterial[] = [
        { 
          id: 1, 
          name: 'Organic Cotton Yarn', 
          quantity: '2.5', 
          unit: 'kg',
          status: 'Delivered', 
          date: '2025-01-10',
          image: 'https://images.pexels.com/photos/6156678/pexels-photo-6156678.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 2, 
          name: 'Natural Wool', 
          quantity: '1', 
          unit: 'kg',
          status: 'Pending', 
          date: '2025-01-15',
          image: 'https://images.pexels.com/photos/6765363/pexels-photo-6765363.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 3, 
          name: 'Bamboo Fiber', 
          quantity: '3', 
          unit: 'kg',
          status: 'In Transit', 
          date: '2025-01-12',
          image: 'https://images.pexels.com/photos/7679669/pexels-photo-7679669.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 4, 
          name: 'Silk Thread', 
          quantity: '500', 
          unit: 'g',
          status: 'Delivered', 
          date: '2025-01-08',
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];
      setMaterials(mockMaterials);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Update Material Quantity on Backend
  const updateMaterialQuantity = async (id: number, newQuantity: string) => {
    try {
      setUpdatingMaterials(prev => new Set(prev).add(id));
      
      const response = await fetch(`/api/materials/${id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ stockChange: parseFloat(newQuantity) - parseFloat(currentQuantity) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedMaterial = await response.json();
      
      // 📝 Update local state
      setMaterials(prev => 
        prev.map(material => 
          material.id === id ? { ...material, quantity: newQuantity } : material
        )
      );
      
      console.log('✅ Material updated successfully:', updatedMaterial);
    } catch (err) {
      console.error('❌ Error updating material:', err);
      // You could show a toast notification here
      alert('Failed to update material quantity. Please try again.');
    } finally {
      setUpdatingMaterials(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // ➕ Increase Quantity
  const increaseQuantity = (material: RawMaterial) => {
    const currentQuantity = parseFloat(material.quantity) || 0;
    const newQuantity = (currentQuantity + 1).toString();
    updateMaterialQuantity(material.id, newQuantity);
  };

  // ➖ Decrease Quantity
  const decreaseQuantity = (material: RawMaterial) => {
    const currentQuantity = parseFloat(material.quantity) || 0;
    if (currentQuantity > 0) {
      const newQuantity = (currentQuantity - 1).toString();
      updateMaterialQuantity(material.id, newQuantity);
    }
  };

  // 🖼️ Handle Image Click
  const handleImageClick = (image: string, name: string) => {
    setSelectedImage({ image, name });
  };

  // 🚀 Component Mount Effect
  useEffect(() => {
    fetchRawMaterials();
  }, []);

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-indigo-100">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading raw materials...</span>
        </div>
      </div>
    );
  }

  // ❌ Error State
  if (error && materials.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-indigo-100">
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="ml-2">
            <p className="text-red-600 font-medium">Error loading materials</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <button 
              onClick={fetchRawMaterials}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <PackagePlus className="w-5 h-5 mr-2 text-indigo-600" />
            Raw Materials
          </h3>
          {onOrderMore && (
            <button
              onClick={onOrderMore}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              Order More
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Image</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Material</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Unit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-indigo-50 hover:bg-indigo-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div 
                      className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
                      onClick={() => material.image && handleImageClick(material.image, material.name)}
                    >
                      {material.image ? (
                        <img 
                          src={material.image} 
                          alt={material.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                          <PackagePlus className="w-6 h-6 text-indigo-600" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{material.name}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{material.quantity}</td>
                  <td className="py-3 px-4 text-gray-800">{material.unit}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {/* ➖ Decrease Button */}
                      <button
                        onClick={() => decreaseQuantity(material)}
                        disabled={parseFloat(material.quantity) <= 0 || updatingMaterials.has(material.id)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      {/* ➕ Increase Button */}
                      <button
                        onClick={() => increaseQuantity(material)}
                        disabled={updatingMaterials.has(material.id)}
                        className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        {updatingMaterials.has(material.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🖼️ Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage.image}
          name={selectedImage.name}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default RawMaterials;
