import React from 'react';
import { USER_ROLES, withRoleProtection } from '../../Auth/AuthContext';
import ArtisanRawMaterials from './ArtisanRawMaterials';

// 🔐 Protected Artisan Raw Materials Page  
const ProtectedArtisanRawMaterials = withRoleProtection(ArtisanRawMaterials, [USER_ROLES.ARTISAN]);

// 🎯 Artisan Dashboard Raw Materials Integration
const ArtisanDashboardRawMaterials = () => {
  return (
    <div className="space-y-6">
      <ProtectedArtisanRawMaterials />
    </div>
  );
};

export default ArtisanDashboardRawMaterials;
