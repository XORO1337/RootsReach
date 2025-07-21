import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DistributorDashboard } from '../../distributor-dashboard';
// Import your existing ArtisanDashboard component
// import { ArtisanDashboard } from '../../path-to-your-artisan-dashboard';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  switch (user.role) {
    case 'distributor':
      return <DistributorDashboard />;
    case 'artisan':
      // Replace this import path with your actual ArtisanDashboard component
      // return <ArtisanDashboard />;
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artisan Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
            <p className="text-sm text-gray-500 mt-2">
              Replace this with your ArtisanDashboard component
            </p>
          </div>
        </div>
      );
    case 'admin':
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">Invalid user role</p>
          </div>
        </div>
      );
  }
};

export default DashboardRouter;