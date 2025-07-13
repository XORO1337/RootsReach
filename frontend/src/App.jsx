import React, { useState } from 'react';
import { AuthLayout, Login, SignUp } from './components/auth';

import Navbar from "./components/dashboard/artisian-dashboard/Navbar";
import WelcomeSection from './components/dashboard/artisian-dashboard/WelcomeSection';
import StatsCards from './components/dashboard/artisian-dashboard/StatsCards';
import RawMaterials from './components/dashboard/artisian-dashboard/RawMaterials';
import OrdersTable from './components/dashboard/artisian-dashboard/OrdersTable';
import EarningsCard from './components/dashboard/artisian-dashboard/EarningsCard';
import ProductsCard from './components/dashboard/artisian-dashboard/ProductsCard';
import TutorialsCard from './components/dashboard/artisian-dashboard/TutorialsCard';
import SupportChat from './components/dashboard/artisian-dashboard/SupportChat';


<Route path="/artisan-dashboard" element={<ArtisianDashboard />} />



import {
  rawMaterials,
  products,
  orders,
  tutorials,
  earningsData,
  dashboardStats,
} from './components/dashboard/artisian-dashboard/data/mockData';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Artisan Dashboard Handlers
  const handleOrderMore = () => {
    console.log('Order more materials clicked');
  };

  const handleSearch = () => {
    console.log('Search orders clicked');
  };

  const handleFilter = () => {
    console.log('Filter orders clicked');
  };

  const handleAddNewProduct = () => {
    console.log('Add new product clicked');
  };

  const handleEditProduct = (productId) => {
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId) => {
    console.log('Delete product:', productId);
  };

  const handlePlayTutorial = (tutorialId) => {
    console.log('Play tutorial:', tutorialId);
  };

  const handleOpenChat = () => {
    console.log('Open support chat');
  };

  // If not logged in yet — show auth screen
  if (!isAuthenticated) {
    return (
      <AuthLayout>
        {isSignUp ? (
          <SignUp onToggleMode={handleToggleMode} onSuccess={handleAuthSuccess} />
        ) : (
          <Login onToggleMode={handleToggleMode} onSuccess={handleAuthSuccess} />
        )}
      </AuthLayout>
    );
  }

  // After login — show Artisan Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <Navbar userName="Maya" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection userName="Maya" />
        <StatsCards stats={dashboardStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <RawMaterials materials={rawMaterials} onOrderMore={handleOrderMore} />
            <OrdersTable orders={orders} onSearch={handleSearch} onFilter={handleFilter} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <EarningsCard earnings={earningsData} />
            <ProductsCard
              products={products}
              onAddNew={handleAddNewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
            <TutorialsCard tutorials={tutorials} onPlayTutorial={handlePlayTutorial} />
          </div>
        </div>
      </div>

      <SupportChat onOpenChat={handleOpenChat} />
    </div>
  );
}

export default App;
