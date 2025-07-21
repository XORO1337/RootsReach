import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArtisanDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    setLoading(true);
    setError('');
    // Fetch artisan profile
    axios.get('/api/artisan/profile', { headers: authHeader })
      .then(res => setProfile(res.data))
      .catch(() => setError('Failed to load profile'));
    // Fetch artisan products
    axios.get('/api/artisan/products', { headers: authHeader })
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, {profile?.name || 'Artisan'}!</h2>
      <h3 className="text-lg font-semibold mb-2">Your Products</h3>
      <ul className="space-y-3">
        {products.map(product => (
          <li key={product._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <span>{product.name}</span>
            <span className="text-gray-500">Stock: {product.availableStock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtisanDashboard;
