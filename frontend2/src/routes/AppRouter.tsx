import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Marketplace from '../pages/Marketplace';
import ArtisanDashboard from '../features/artisan-dashboard';
import NotFound from '../pages/NotFound';
import { Login, Signup } from '../pages/auth';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Marketplace Routes */}
        <Route path="/" element={<Marketplace />} />
        <Route path="/marketplace" element={<Navigate to="/" replace />} />
        
        {/* Artisan Dashboard Routes */}
        <Route path="/artisan/*" element={<ArtisanDashboard />} />
        
        {/* Fallback Routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
