import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import {
  WelcomeHeader,
  OrdersOverview,
  Wishlist,
  SavedProducts
} from './components';

// Dummy user data
const dummyUser = {
  id: 1,
  name: "Sarah Johnson",
  firstName: "Sarah",
  email: "sarah.johnson@email.com",
  avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  memberSince: "2024",
  stats: {
    totalOrders: 12,
    wishlistItems: 8,
    rewardPoints: 1250,
    impactScore: 89
  }
};

// Dummy orders data
const dummyOrders = [
  {
    id: "ORD-2025-001",
    productName: "Handwoven Silk Scarf",
    artisan: "Maria Santos",
    image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
    status: "delivered",
    total: 89,
    date: "Jan 15, 2025",
    deliveredDate: "Jan 18, 2025"
  },
  {
    id: "ORD-2025-002",
    productName: "Ceramic Bowl Set",
    artisan: "Priya Sharma",
    image: "https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg",
    status: "shipped",
    total: 65,
    date: "Jan 20, 2025",
    expectedDate: "Jan 25, 2025"
  },
  {
    id: "ORD-2025-003",
    productName: "Silver Jewelry Set",
    artisan: "Fatima Al-Zahra",
    image: "https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg",
    status: "processing",
    total: 150,
    date: "Jan 22, 2025"
  }
];

// Dummy wishlist data
const dummyWishlist = [
  {
    id: 1,
    name: "Embroidered Table Runner",
    artisan: "Ana Rodriguez",
    price: 78,
    rating: 5,
    reviews: 12,
    image: "https://images.pexels.com/photos/7679447/pexels-photo-7679447.jpeg",
    description: "Beautiful hand-embroidered table runner with traditional patterns."
  },
  {
    id: 2,
    name: "Handmade Leather Wallet",
    artisan: "Carlos Mendez",
    price: 45,
    rating: 4,
    reviews: 8,
    image: "https://images.pexels.com/photos/5691616/pexels-photo-5691616.jpeg",
    description: "Premium leather wallet crafted with traditional techniques."
  },
  {
    id: 3,
    name: "Woven Basket Set",
    artisan: "Aminata Kone",
    price: 92,
    rating: 5,
    reviews: 15,
    image: "https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg",
    description: "Set of 3 handwoven baskets perfect for home organization."
  }
];

// Dummy saved products data
const dummySavedProducts = [
  {
    id: 1,
    name: "Ceramic Vase Collection",
    artisan: "Elena Popov",
    price: 125,
    image: "https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg",
    savedDate: "3 days ago"
  },
  {
    id: 2,
    name: "Hand-painted Scarf",
    artisan: "Isabella Garcia",
    price: 67,
    image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
    savedDate: "1 week ago"
  }
];

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userCart, setUserCart] = useState([]);

  const handleAddToCart = (product) => {
    setUserCart(prev => [...prev, product]);
    console.log('Added to cart:', product);
  };

  const handleRemoveFromWishlist = (productId) => {
    console.log('Removed from wishlist:', productId);
  };

  const handleRemoveSaved = (productId) => {
    console.log('Removed from saved:', productId);
  };

  const navigation = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'wishlist', name: 'Wishlist', icon: '❤️' },
    { id: 'saved', name: 'Saved Products', icon: '🔖' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isLoggedIn={true}
        userCart={userCart}
      />
      
      <WelcomeHeader user={dummyUser} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-rose-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <OrdersOverview orders={dummyOrders} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Wishlist 
                    wishlistItems={dummyWishlist.slice(0, 2)} 
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                  <SavedProducts 
                    savedProducts={dummySavedProducts}
                    onRemoveSaved={handleRemoveSaved}
                  />
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <OrdersOverview orders={dummyOrders} />
            )}

            {activeTab === 'wishlist' && (
              <Wishlist 
                wishlistItems={dummyWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
              />
            )}

            {activeTab === 'saved' && (
              <SavedProducts 
                savedProducts={dummySavedProducts}
                onRemoveSaved={handleRemoveSaved}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;