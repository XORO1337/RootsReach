import React from 'react';
import { createRoot } from 'react-dom/client';
import DistributorDashboard from './components/DistributorDashboard';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DistributorDashboard />
  </React.StrictMode>
);
