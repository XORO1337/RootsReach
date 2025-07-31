import React, { useState, useEffect } from 'react';
import { PackagePlus, Plus, Minus, X, Loader2, AlertCircle, ShoppingCart, CheckCircle } from 'lucide-react';

// 🎯 Artisan Raw Materials Management Component
const ArtisanRawMaterials = () => {
  // 🏗️ State Management
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [orderingMaterials, setOrderingMaterials] = useState(new Set());
  const [orderSuccess, setOrderSuccess] = useState(null);

  // 🔄 Fetch Raw Materials from Backend
  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/materials', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMaterials(data);
      
      // 📝 Initialize order quantities
      const initialQuantities = {};
      data.forEach(material => {
        initialQuantities[material.id] = 1;
      });
      setOrderQuantities(initialQuantities);
      
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials. Please try again.');
      
      // 🔄 Fallback to mock data for development
      const mockMaterials = [
        { 
          id: 1, 
          name: 'Organic Cotton Yarn', 
          quantity: '25', 
          unit: 'kg',
          status: 'Available', 
          date: '2025-01-10',
          image: 'https://images.pexels.com/photos/6156678/pexels-photo-6156678.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 2, 
          name: 'Natural Wool', 
          quantity: '15', 
          unit: 'kg',
          status: 'Available', 
          date: '2025-01-15',
          image: 'https://images.pexels.com/photos/6765363/pexels-photo-6765363.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 3, 
          name: 'Bamboo Fiber', 
          quantity: '30', 
          unit: 'kg',
          status: 'Available', 
          date: '2025-01-12',
          image: 'https://images.pexels.com/photos/7679669/pexels-photo-7679669.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 4, 
          name: 'Silk Thread', 
          quantity: '5000', 
          unit: 'g',
          status: 'Available', 
          date: '2025-01-08',
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];
      setMaterials(mockMaterials);
      
      // Initialize quantities for mock data
      const initialQuantities = {};
      mockMaterials.forEach(material => {
        initialQuantities[material.id] = 1;
      });
      setOrderQuantities(initialQuantities);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Increase Order Quantity
  const increaseQuantity = (materialId, maxQuantity) => {
    setOrderQuantities(prev => {
      const currentQty = prev[materialId] || 1;
      const maxAvailable = parseFloat(maxQuantity);
      const newQty = Math.min(currentQty + 1, maxAvailable);
      return { ...prev, [materialId]: newQty };
    });
  };

  // ➖ Decrease Order Quantity
  const decreaseQuantity = (materialId) => {
    setOrderQuantities(prev => {
      const currentQty = prev[materialId] || 1;
      const newQty = Math.max(currentQty - 1, 1);
      return { ...prev, [materialId]: newQty };
    });
  };

  // 🛒 Place Order for Material
  const handleOrderMaterial = async (material) => {
    const orderQty = orderQuantities[material.id];
    
    if (!orderQty || orderQty <= 0) {
      alert('Please select a valid quantity');
      return;
    }

    if (orderQty > parseFloat(material.quantity)) {
      alert('Order quantity cannot exceed available stock');
      return;
    }

    try {
      setOrderingMaterials(prev => new Set(prev).add(material.id));
      
      const response = await fetch(`/api/materials/${material.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          stockChange: -orderQty, // Decrease stock by ordered quantity
          artisanId: localStorage.getItem('userId') // Assuming user ID is stored
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // 📝 Update local material quantity
      setMaterials(prev => 
        prev.map(mat => 
          mat.id === material.id 
            ? { ...mat, quantity: (parseFloat(mat.quantity) - orderQty).toString() }
            : mat
        )
      );
      
      // 🎉 Show success message
      setOrderSuccess(`Successfully ordered ${orderQty} ${material.unit} of ${material.name}!`);
      setTimeout(() => setOrderSuccess(null), 5000);
      
      // 🔄 Reset order quantity to 1
      setOrderQuantities(prev => ({ ...prev, [material.id]: 1 }));
      
      console.log('✅ Order placed successfully:', result);
      
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderingMaterials(prev => {
        const newSet = new Set(prev);
        newSet.delete(material.id);
        return newSet;
      });
    }
  };

  // 🖼️ Handle Image Click
  const handleImageClick = (image, name) => {
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
        {/* 📊 Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PackagePlus className="w-6 h-6 text-indigo-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Raw Materials</h3>
              <p className="text-sm text-gray-600">Order materials for your creations</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {materials.length} materials available
          </div>
        </div>

        {/* 🎉 Success Message */}
        {orderSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{orderSuccess}</span>
          </div>
        )}

        {/* 📋 Materials Grid */}
        {materials.length === 0 ? (
          <div className="text-center py-12">
            <PackagePlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No raw materials available</p>
            <p className="text-sm text-gray-500">Check back later for new materials</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => {
              const availableQty = parseFloat(material.quantity);
              const orderQty = orderQuantities[material.id] || 1;
              const isOrdering = orderingMaterials.has(material.id);
              const isOutOfStock = availableQty <= 0;
              
              return (
                <div key={material.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  {/* 🖼️ Material Image */}
                  <div 
                    className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all mb-4"
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
                        <PackagePlus className="w-12 h-12 text-indigo-600" />
                      </div>
                    )}
                  </div>

                  {/* 📝 Material Info */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{material.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">
                          Available: {material.quantity} {material.unit}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isOutOfStock 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isOutOfStock ? 'Out of Stock' : 'Available'}
                        </span>
                      </div>
                    </div>

                    {/* 🛒 Order Section */}
                    {!isOutOfStock && (
                      <div className="space-y-3">
                        {/* 🔢 Quantity Selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Order Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => decreaseQuantity(material.id)}
                              disabled={orderQty <= 1 || isOrdering}
                              className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="w-12 text-center font-medium">
                              {orderQty}
                            </span>
                            
                            <button
                              onClick={() => increaseQuantity(material.id, material.quantity)}
                              disabled={orderQty >= availableQty || isOrdering}
                              className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 📊 Order Summary */}
                        <div className="text-xs text-gray-500 text-center">
                          Ordering {orderQty} {material.unit} of {availableQty} {material.unit} available
                        </div>

                        {/* 🛒 Order Button */}
                        <button
                          onClick={() => handleOrderMaterial(material)}
                          disabled={isOrdering || orderQty > availableQty}
                          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isOrdering ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Ordering...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Order {orderQty} {material.unit}
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* 🚫 Out of Stock Message */}
                    {isOutOfStock && (
                      <div className="text-center py-3">
                        <p className="text-red-600 font-medium">Currently out of stock</p>
                        <p className="text-sm text-gray-500">Check back later</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🖼️ Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedImage.name}</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <img src={selectedImage.image} alt={selectedImage.name} className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};

export default ArtisanRawMaterials;
