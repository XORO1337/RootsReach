import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ProductCatalog from './components/ProductCatalog';
import OrderHistory from './components/OrderHistory';
import Support from './components/Support';
import axios from 'axios';
import { useEffect } from 'react';
import { mockProducts } from './data/mockData';

const TABS = [
  { key: 'products', label: 'Product Catalog' },
  { key: 'orders', label: 'Order History' },
  { key: 'support', label: 'Support' },
];

const DistributorDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'support'>('products');
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    // Uncomment below to use backend when ready
    // axios.get('/api/products', { headers: authHeader })
    //   .then(res => setProducts(res.data))
    //   .catch(err => console.error('Error fetching products:', err));
    axios.get('/api/orders', { headers: authHeader })
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const handlePlaceOrder = async (productId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/orders', { productId, quantity }, { headers: authHeader });
      setOrders(prev => [res.data, ...prev]);
      alert('Order placed successfully!');
    } catch (err) {
      // Fallback: create a mock order if backend fails
      const mockOrder = {
        id: Date.now().toString(),
        productId,
        quantity,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      setOrders(prev => [mockOrder, ...prev]);
      alert('Backend unavailable. Mock order placed.');
      console.error('Error placing order:', err);
    }
  };

  const renderContent = () => {
    const productsArray = Array.isArray(products) ? products : [];
    switch (activeTab) {
      case 'products':
        return <ProductCatalog products={productsArray} onPlaceOrder={handlePlaceOrder} />;
      case 'orders':
        return <OrderHistory orders={orders} />;
      case 'support':
        return <Support />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

const DistributorDashboard: React.FC = () => <DistributorDashboardContent />;

export default DistributorDashboard;
