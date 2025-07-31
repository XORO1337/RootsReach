import React from 'react';
import { USER_ROLES, withRoleProtection } from '../../Auth/AuthContext';
import AdminRawMaterials from './AdminRawMaterials';

// 🔐 Protected Admin Raw Materials Page
const ProtectedAdminRawMaterials = withRoleProtection(AdminRawMaterials, [USER_ROLES.ADMIN]);

// 🎯 Admin Dashboard Raw Materials Integration
const AdminDashboardRawMaterials = () => {
  return (
    <div className="space-y-6">
      <ProtectedAdminRawMaterials />
    </div>
  );
};

export default AdminDashboardRawMaterials;
