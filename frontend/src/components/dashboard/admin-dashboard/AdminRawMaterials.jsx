import React, { useState, useEffect } from 'react';
import { PackagePlus, Plus, Edit, Trash2, X, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// 🎯 Admin Raw Materials Management Component
const AdminRawMaterials = () => {
  // 🏗️ State Management
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 📝 Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    unit: 'kg',
    supplierId: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // 🔄 Fetch Raw Materials
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
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Failed to load raw materials. Please try again.');
      
      // 🔄 Fallback to mock data for development
      const mockMaterials = [
        { 
          id: 1, 
          name: 'Organic Cotton Yarn', 
          description: 'High-quality organic cotton yarn for sustainable textile production',
          quantity: '25', 
          unit: 'kg',
          supplierId: 'SUP001',
          status: 'Available', 
          date: '2025-01-10',
          image: 'https://images.pexels.com/photos/6156678/pexels-photo-6156678.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 2, 
          name: 'Natural Wool', 
          description: 'Premium natural wool sourced from ethical farms',
          quantity: '15', 
          unit: 'kg',
          supplierId: 'SUP002',
          status: 'Available', 
          date: '2025-01-15',
          image: 'https://images.pexels.com/photos/6765363/pexels-photo-6765363.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 3, 
          name: 'Bamboo Fiber', 
          description: 'Eco-friendly bamboo fiber with antimicrobial properties',
          quantity: '30', 
          unit: 'kg',
          supplierId: 'SUP003',
          status: 'Available', 
          date: '2025-01-12',
          image: 'https://images.pexels.com/photos/7679669/pexels-photo-7679669.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        { 
          id: 4, 
          name: 'Silk Thread', 
          description: 'Luxurious silk thread for high-end fashion applications',
          quantity: '5000', 
          unit: 'g',
          supplierId: 'SUP004',
          status: 'Available', 
          date: '2025-01-08',
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];
      setMaterials(mockMaterials);
    } finally {
      setLoading(false);
    }
  };

  // 📤 Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 🔍 Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      // 🔍 Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // 🖼️ Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 📝 Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ➕ Add New Raw Material
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.quantity || !formData.supplierId || !formData.image) {
      alert('Please fill all required fields and select an image');
      return;
    }

    try {
      setSubmitting(true);
      
      // 📦 Create FormData for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('quantity', formData.quantity);
      data.append('unit', formData.unit);
      data.append('supplierId', formData.supplierId);
      data.append('image', formData.image);
      data.append('status', 'Available');
      data.append('date', new Date().toISOString().split('T')[0]);

      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newMaterial = await response.json();
      
      // 📝 Update local state
      setMaterials(prev => [newMaterial, ...prev]);
      
      // 🔄 Reset form
      setFormData({ name: '', description: '', quantity: '', unit: 'kg', supplierId: '', image: null });
      setImagePreview(null);
      setShowAddForm(false);
      
      alert('✅ Raw material added successfully!');
      
    } catch (err) {
      console.error('❌ Error adding material:', err);
      alert('Failed to add material. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 🗑️ Delete Material (Optional)
  const handleDeleteMaterial = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMaterials(prev => prev.filter(material => material.id !== id));
      alert('✅ Material deleted successfully!');
      
    } catch (err) {
      console.error('❌ Error deleting material:', err);
      alert('Failed to delete material. Please try again.');
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
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading raw materials...</span>
        </div>
      </div>
    );
  }

  // ❌ Error State
  if (error && materials.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="ml-2">
            <p className="text-red-600 font-medium">Error loading materials</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <button 
              onClick={fetchRawMaterials}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 📊 Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PackagePlus className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Raw Materials Management</h2>
              <p className="text-gray-600">Manage inventory and add new materials</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Material
          </button>
        </div>
      </div>

      {/* ➕ Add Material Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Raw Material</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ name: '', description: '', quantity: '', unit: 'kg', supplierId: '', image: null });
                setImagePreview(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 📝 Left Column - Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Cotton Yarn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the material..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier ID *
                </label>
                <input
                  type="text"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleInputChange}
                  placeholder="e.g., SUP001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lbs">lbs</option>
                    <option value="yards">yards</option>
                    <option value="meters">meters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* 🖼️ Right Column - Image Preview */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="w-full h-64 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <PackagePlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 🔘 Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Adding Material...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Raw Material
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 Materials List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Inventory</h3>
        
        {materials.length === 0 ? (
          <div className="text-center py-12">
            <PackagePlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No raw materials found</p>
            <p className="text-sm text-gray-500">Add your first material to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Material</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Unit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div 
                        className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                        onClick={() => material.image && handleImageClick(material.image, material.name)}
                      >
                        {material.image ? (
                          <img 
                            src={material.image} 
                            alt={material.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <PackagePlus className="w-8 h-8 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{material.name}</div>
                      <div className="text-sm text-gray-500">Added {material.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800 text-sm max-w-xs truncate" title={material.description}>
                        {material.description || 'No description'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{material.quantity}</td>
                    <td className="py-3 px-4 text-gray-800">{material.unit}</td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800 text-sm">
                        {material.supplierId || 'No supplier'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {material.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => console.log('Edit material:', material.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Material"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};

export default AdminRawMaterials;
