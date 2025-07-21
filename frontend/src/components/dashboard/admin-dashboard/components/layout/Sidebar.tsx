import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Bell,
  Settings2,
  Home,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'users', label: t('nav.userManagement'), icon: Users },
    { id: 'products', label: t('nav.productModeration'), icon: Package },
    { id: 'orders', label: t('nav.orderMonitoring'), icon: ShoppingCart },
    { id: 'reports', label: t('nav.feedbackReports'), icon: MessageSquare },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart3 },
    { id: 'notifications', label: t('nav.notifications'), icon: Bell },
    { id: 'exports', label: t('nav.dataExport'), icon: FileText },
    { id: 'settings', label: t('nav.settings'), icon: Settings2 },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col border-r border-gray-200">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{t('header.adminDashboard')}</h1>
        <p className="text-sm text-gray-600">{t('header.socialImpactPlatform')}</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{t('header.adminUser')}</p>
            <p className="text-xs text-gray-600">{t('header.adminEmail')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;