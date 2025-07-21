import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import UserManagement from './components/user-management/UserManagement';
import ProductModeration from './components/product-moderation/ProductModeration';
import OrderMonitoring from './components/order-monitoring/OrderMonitoring';
import FeedbackReports from './components/feedback-reports/FeedbackReports';
import Analytics from './components/analytics/Analytics';
import Notifications from './components/notifications/Notifications';
import DataExport from './components/data-export/DataExport';

const AdminDashboardContent: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductModeration />;
      case 'orders':
        return <OrderMonitoring />;
      case 'reports':
        return <FeedbackReports />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'exports':
        return <DataExport />;
      default:
        return <Analytics />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t('page.dashboardOverview');
      case 'users':
        return t('page.userManagement');
      case 'products':
        return t('page.productModeration');
      case 'orders':
        return t('page.orderMonitoring');
      case 'reports':
        return t('page.feedbackReports');
      case 'analytics':
        return t('page.analyticsInsights');
      case 'notifications':
        return t('page.notificationCenter');
      case 'exports':
        return t('page.dataExport');
      default:
        return t('nav.dashboard');
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t('subtitle.platformOverview');
      case 'users':
        return t('subtitle.manageUsers');
      case 'products':
        return t('subtitle.reviewProducts');
      case 'orders':
        return t('subtitle.monitorOrders');
      case 'reports':
        return t('subtitle.handleFeedback');
      case 'analytics':
        return t('subtitle.detailedAnalytics');
      case 'notifications':
        return t('subtitle.recentActivity');
      case 'exports':
        return t('subtitle.exportData');
      default:
        return '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {getPageContent()}
      </main>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminDashboardContent />
    </LanguageProvider>
  );
};

export default AdminDashboard;