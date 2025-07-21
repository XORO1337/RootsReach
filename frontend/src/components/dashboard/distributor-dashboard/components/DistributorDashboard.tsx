import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Navigation from './Navigation';
import ProductCatalog from './ProductCatalog';
import OrderHistory from './OrderHistory';
import Support from './Support';
import { Order } from '../types';

const DistributorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'support'>('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get('/api/products', { headers: authHeader })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
    axios.get('/api/orders', { headers: authHeader })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const totalStock = products.reduce((sum, p) => sum + p.availableStock, 0);

  const handlePlaceOrder = async (productId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/orders', { productId, quantity }, { headers: authHeader });
      setOrders(prev => [res.data, ...prev]);
      toast.success('Order placed successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to place order. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <ProductCatalog
            products={products}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      case 'orders':
        return <OrderHistory orders={orders} />;
      case 'support':
        return <Support />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        totalProducts={products.length}
        totalStock={totalStock}
      />
      <main>
        {renderContent()}
      </main>
      <ToastContainer />
    </div>
  );
};

export default DistributorDashboard;