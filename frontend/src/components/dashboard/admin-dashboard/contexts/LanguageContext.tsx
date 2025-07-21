import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.userManagement': 'User Management',
    'nav.productModeration': 'Product Moderation',
    'nav.orderMonitoring': 'Order Monitoring',
    'nav.feedbackReports': 'Feedback & Reports',
    'nav.analytics': 'Analytics',
    'nav.notifications': 'Notifications',
    'nav.dataExport': 'Data Export',
    'nav.settings': 'Settings',
    
    // Header
    'header.adminDashboard': 'Admin Dashboard',
    'header.socialImpactPlatform': 'Social Impact Platform',
    'header.search': 'Search...',
    'header.adminUser': 'Admin User',
    'header.adminEmail': 'admin@platform.com',
    
    // Page Titles
    'page.dashboardOverview': 'Dashboard Overview',
    'page.userManagement': 'User Management',
    'page.productModeration': 'Product Moderation',
    'page.orderMonitoring': 'Order Monitoring',
    'page.feedbackReports': 'Feedback & Reports',
    'page.analyticsInsights': 'Analytics & Insights',
    'page.notificationCenter': 'Notification Center',
    'page.dataExport': 'Data Export',
    
    // Page Subtitles
    'subtitle.platformOverview': 'Platform overview and key metrics',
    'subtitle.manageUsers': 'Manage artisans, distributors, and general users',
    'subtitle.reviewProducts': 'Review and moderate product listings',
    'subtitle.monitorOrders': 'Monitor platform-wide order activity',
    'subtitle.handleFeedback': 'Handle user feedback and reports',
    'subtitle.detailedAnalytics': 'Detailed analytics and performance metrics',
    'subtitle.recentActivity': 'Recent platform activity and alerts',
    'subtitle.exportData': 'Export platform data for analysis',
    
    // Common
    'common.totalUsers': 'Total Users',
    'common.totalProducts': 'Total Products',
    'common.totalOrders': 'Total Orders',
    'common.totalRevenue': 'Total Revenue',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.approve': 'Approve',
    'common.reject': 'Reject',
    'common.ban': 'Ban',
    'common.unban': 'Unban',
    'common.active': 'Active',
    'common.pending': 'Pending',
    'common.banned': 'Banned',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
    'common.flagged': 'Flagged',
    'common.verified': 'Verified',
    'common.unverified': 'Unverified',
    'common.processing': 'Processing',
    'common.shipped': 'Shipped',
    'common.delivered': 'Delivered',
    'common.cancelled': 'Cancelled',
    'common.new': 'New',
    'common.inProgress': 'In Progress',
    'common.resolved': 'Resolved',
    'common.high': 'High',
    'common.medium': 'Medium',
    'common.low': 'Low',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.amount': 'Amount',
    'common.quantity': 'Quantity',
    'common.category': 'Category',
    'common.price': 'Price',
    'common.stock': 'Stock',
    'common.sales': 'Sales',
    
    // User Management
    'users.artisan': 'Artisan',
    'users.distributor': 'Distributor',
    'users.generalUser': 'General User',
    'users.artisans': 'Artisans',
    'users.distributors': 'Distributors',
    'users.generalUsers': 'General Users',
    'users.pendingApproval': 'Pending Approval',
    'users.searchUsers': 'Search users...',
    'users.allRoles': 'All Roles',
    'users.allStatus': 'All Status',
    'users.advancedFilters': 'Advanced Filters',
    'users.joinDate': 'Join Date',
    'users.lastActive': 'Last Active',
    'users.verification': 'Verification',
    'users.activity': 'Activity',
    'users.markAsRead': 'Mark as Read',
    'users.markAllAsRead': 'Mark All as Read',
    
    // Product Management
    'products.searchProducts': 'Search products...',
    'products.allCategories': 'All Categories',
    'products.pendingApproval': 'Pending Approval',
    'products.reportedItems': 'Reported Items',
    'products.outOfStock': 'Out of Stock',
    'products.highDemand': 'High Demand',
    'products.addedBy': 'by',
    'products.addedOn': 'Added',
    'products.unitsSold': 'units sold',
    
    // Order Management
    'orders.searchOrders': 'Search orders...',
    'orders.allBuyers': 'All Buyers',
    'orders.allTime': 'All Time',
    'orders.today': 'Today',
    'orders.thisWeek': 'This Week',
    'orders.thisMonth': 'This Month',
    'orders.orderId': 'Order ID',
    'orders.buyer': 'Buyer',
    'orders.product': 'Product',
    'orders.artisan': 'Artisan',
    'orders.orderDate': 'Order Date',
    'orders.avgOrderValue': 'Avg Order Value',
    'orders.thisWeekOrders': 'Orders This Week',
    
    // Analytics
    'analytics.userDistribution': 'User Distribution',
    'analytics.productStatus': 'Product Status',
    'analytics.revenueTrends': 'Revenue Trends',
    'analytics.topArtisan': 'Top Artisan',
    'analytics.topProduct': 'Top Product',
    'analytics.salesThisMonth': 'sales this month',
    'analytics.fromLastMonth': 'from last month',
    'analytics.fromLastWeek': 'from last week',
    
    // Notifications
    'notifications.totalNotifications': 'Total Notifications',
    'notifications.unread': 'Unread',
    'notifications.highPriority': 'High Priority',
    'notifications.read': 'Read',
    'notifications.allNotifications': 'All Notifications',
    'notifications.unreadOnly': 'Unread Only',
    'notifications.userSignups': 'User Signups',
    'notifications.productUpdates': 'Product Updates',
    'notifications.orderNotifications': 'Order Notifications',
    'notifications.reports': 'Reports',
    'notifications.system': 'System',
    
    // Reports
    'reports.totalReports': 'Total Reports',
    'reports.newReports': 'New Reports',
    'reports.searchReports': 'Search reports...',
    'reports.allTypes': 'All Types',
    'reports.qualityIssues': 'Quality Issues',
    'reports.fraudulentActivity': 'Fraudulent Activity',
    'reports.reportedOn': 'Reported on',
    'reports.reporter': 'Reporter',
    'reports.target': 'Target',
    'reports.resolvedOn': 'Resolved',
    'reports.startReview': 'Start Review',
    'reports.markResolved': 'Mark Resolved',
    
    // Data Export
    'export.dataExport': 'Data Export',
    'export.exportDescription': 'Export platform data for analysis, backup, or compliance purposes.',
    'export.userData': 'User Data',
    'export.userDataDesc': 'Export user information, roles, and activity data',
    'export.productData': 'Product Data',
    'export.productDataDesc': 'Export product listings, status, and performance metrics',
    'export.orderData': 'Order Data',
    'export.orderDataDesc': 'Export order history, transactions, and fulfillment data',
    'export.reportsData': 'Reports & Feedback',
    'export.reportsDataDesc': 'Export user reports, feedback, and moderation actions',
    'export.exportConfiguration': 'Export Configuration',
    'export.startDate': 'Start Date',
    'export.endDate': 'End Date',
    'export.exportFormat': 'Export Format',
    'export.exportData': 'Export Data',
    'export.recentExports': 'Recent Exports',
    'export.download': 'Download',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.userManagement': 'उपयोगकर्ता प्रबंधन',
    'nav.productModeration': 'उत्पाद मॉडरेशन',
    'nav.orderMonitoring': 'ऑर्डर निगरानी',
    'nav.feedbackReports': 'फीडबैक और रिपोर्ट',
    'nav.analytics': 'एनालिटिक्स',
    'nav.notifications': 'सूचनाएं',
    'nav.dataExport': 'डेटा एक्सपोर्ट',
    'nav.settings': 'सेटिंग्स',
    
    // Header
    'header.adminDashboard': 'एडमिन डैशबोर्ड',
    'header.socialImpactPlatform': 'सामाजिक प्रभाव प्लेटफॉर्म',
    'header.search': 'खोजें...',
    'header.adminUser': 'एडमिन उपयोगकर्ता',
    'header.adminEmail': 'admin@platform.com',
    
    // Page Titles
    'page.dashboardOverview': 'डैशबोर्ड अवलोकन',
    'page.userManagement': 'उपयोगकर्ता प्रबंधन',
    'page.productModeration': 'उत्पाद मॉडरेशन',
    'page.orderMonitoring': 'ऑर्डर निगरानी',
    'page.feedbackReports': 'फीडबैक और रिपोर्ट',
    'page.analyticsInsights': 'एनालिटिक्स और अंतर्दृष्टि',
    'page.notificationCenter': 'सूचना केंद्र',
    'page.dataExport': 'डेटा एक्सपोर्ट',
    
    // Page Subtitles
    'subtitle.platformOverview': 'प्लेटफॉर्म अवलोकन और मुख्य मेट्रिक्स',
    'subtitle.manageUsers': 'कारीगरों, वितरकों और सामान्य उपयोगकर्ताओं का प्रबंधन करें',
    'subtitle.reviewProducts': 'उत्पाद सूची की समीक्षा और मॉडरेशन करें',
    'subtitle.monitorOrders': 'प्लेटफॉर्म-व्यापी ऑर्डर गतिविधि की निगरानी करें',
    'subtitle.handleFeedback': 'उपयोगकर्ता फीडबैक और रिपोर्ट को संभालें',
    'subtitle.detailedAnalytics': 'विस्तृत एनालिटिक्स और प्रदर्शन मेट्रिक्स',
    'subtitle.recentActivity': 'हाल की प्लेटफॉर्म गतिविधि और अलर्ट',
    'subtitle.exportData': 'विश्लेषण के लिए प्लेटफॉर्म डेटा एक्सपोर्ट करें',
    
    // Common
    'common.totalUsers': 'कुल उपयोगकर्ता',
    'common.totalProducts': 'कुल उत्पाद',
    'common.totalOrders': 'कुल ऑर्डर',
    'common.totalRevenue': 'कुल राजस्व',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.view': 'देखें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.approve': 'अनुमोदित करें',
    'common.reject': 'अस्वीकार करें',
    'common.ban': 'प्रतिबंधित करें',
    'common.unban': 'प्रतिबंध हटाएं',
    'common.active': 'सक्रिय',
    'common.pending': 'लंबित',
    'common.banned': 'प्रतिबंधित',
    'common.approved': 'अनुमोदित',
    'common.rejected': 'अस्वीकृत',
    'common.flagged': 'फ्लैग किया गया',
    'common.verified': 'सत्यापित',
    'common.unverified': 'असत्यापित',
    'common.processing': 'प्रसंस्करण',
    'common.shipped': 'भेजा गया',
    'common.delivered': 'वितरित',
    'common.cancelled': 'रद्द',
    'common.new': 'नया',
    'common.inProgress': 'प्रगति में',
    'common.resolved': 'हल किया गया',
    'common.high': 'उच्च',
    'common.medium': 'मध्यम',
    'common.low': 'कम',
    'common.actions': 'कार्य',
    'common.status': 'स्थिति',
    'common.date': 'दिनांक',
    'common.amount': 'राशि',
    'common.quantity': 'मात्रा',
    'common.category': 'श्रेणी',
    'common.price': 'मूल्य',
    'common.stock': 'स्टॉक',
    'common.sales': 'बिक्री',
    
    // User Management
    'users.artisan': 'कारीगर',
    'users.distributor': 'वितरक',
    'users.generalUser': 'सामान्य उपयोगकर्ता',
    'users.artisans': 'कारीगर',
    'users.distributors': 'वितरक',
    'users.generalUsers': 'सामान्य उपयोगकर्ता',
    'users.pendingApproval': 'अनुमोदन लंबित',
    'users.searchUsers': 'उपयोगकर्ता खोजें...',
    'users.allRoles': 'सभी भूमिकाएं',
    'users.allStatus': 'सभी स्थिति',
    'users.advancedFilters': 'उन्नत फिल्टर',
    'users.joinDate': 'शामिल होने की तारीख',
    'users.lastActive': 'अंतिम सक्रिय',
    'users.verification': 'सत्यापन',
    'users.activity': 'गतिविधि',
    'users.markAsRead': 'पढ़ा हुआ चिह्नित करें',
    'users.markAllAsRead': 'सभी को पढ़ा हुआ चिह्नित करें',
    
    // Product Management
    'products.searchProducts': 'उत्पाद खोजें...',
    'products.allCategories': 'सभी श्रेणियां',
    'products.pendingApproval': 'अनुमोदन लंबित',
    'products.reportedItems': 'रिपोर्ट किए गए आइटम',
    'products.outOfStock': 'स्टॉक समाप्त',
    'products.highDemand': 'उच्च मांग',
    'products.addedBy': 'द्वारा',
    'products.addedOn': 'जोड़ा गया',
    'products.unitsSold': 'यूनिट बेचे गए',
    
    // Order Management
    'orders.searchOrders': 'ऑर्डर खोजें...',
    'orders.allBuyers': 'सभी खरीदार',
    'orders.allTime': 'सभी समय',
    'orders.today': 'आज',
    'orders.thisWeek': 'इस सप्ताह',
    'orders.thisMonth': 'इस महीने',
    'orders.orderId': 'ऑर्डर आईडी',
    'orders.buyer': 'खरीदार',
    'orders.product': 'उत्पाद',
    'orders.artisan': 'कारीगर',
    'orders.orderDate': 'ऑर्डर दिनांक',
    'orders.avgOrderValue': 'औसत ऑर्डर मूल्य',
    'orders.thisWeekOrders': 'इस सप्ताह के ऑर्डर',
    
    // Analytics
    'analytics.userDistribution': 'उपयोगकर्ता वितरण',
    'analytics.productStatus': 'उत्पाद स्थिति',
    'analytics.revenueTrends': 'राजस्व रुझान',
    'analytics.topArtisan': 'शीर्ष कारीगर',
    'analytics.topProduct': 'शीर्ष उत्पाद',
    'analytics.salesThisMonth': 'इस महीने की बिक्री',
    'analytics.fromLastMonth': 'पिछले महीने से',
    'analytics.fromLastWeek': 'पिछले सप्ताह से',
    
    // Notifications
    'notifications.totalNotifications': 'कुल सूचनाएं',
    'notifications.unread': 'अपठित',
    'notifications.highPriority': 'उच्च प्राथमिकता',
    'notifications.read': 'पढ़ा गया',
    'notifications.allNotifications': 'सभी सूचनाएं',
    'notifications.unreadOnly': 'केवल अपठित',
    'notifications.userSignups': 'उपयोगकर्ता साइनअप',
    'notifications.productUpdates': 'उत्पाद अपडेट',
    'notifications.orderNotifications': 'ऑर्डर सूचनाएं',
    'notifications.reports': 'रिपोर्ट',
    'notifications.system': 'सिस्टम',
    
    // Reports
    'reports.totalReports': 'कुल रिपोर्ट',
    'reports.newReports': 'नई रिपोर्ट',
    'reports.searchReports': 'रिपोर्ट खोजें...',
    'reports.allTypes': 'सभी प्रकार',
    'reports.qualityIssues': 'गुणवत्ता के मुद्दे',
    'reports.fraudulentActivity': 'धोखाधड़ी गतिविधि',
    'reports.reportedOn': 'रिपोर्ट की गई',
    'reports.reporter': 'रिपोर्टर',
    'reports.target': 'लक्ष्य',
    'reports.resolvedOn': 'हल किया गया',
    'reports.startReview': 'समीक्षा शुरू करें',
    'reports.markResolved': 'हल किया गया चिह्नित करें',
    
    // Data Export
    'export.dataExport': 'डेटा एक्सपोर्ट',
    'export.exportDescription': 'विश्लेषण, बैकअप या अनुपालन उद्देश्यों के लिए प्लेटफॉर्म डेटा एक्सपोर्ट करें।',
    'export.userData': 'उपयोगकर्ता डेटा',
    'export.userDataDesc': 'उपयोगकर्ता जानकारी, भूमिकाएं और गतिविधि डेटा एक्सपोर्ट करें',
    'export.productData': 'उत्पाद डेटा',
    'export.productDataDesc': 'उत्पाद सूची, स्थिति और प्रदर्शन मेट्रिक्स एक्सपोर्ट करें',
    'export.orderData': 'ऑर्डर डेटा',
    'export.orderDataDesc': 'ऑर्डर इतिहास, लेनदेन और पूर्ति डेटा एक्सपोर्ट करें',
    'export.reportsData': 'रिपोर्ट और फीडबैक',
    'export.reportsDataDesc': 'उपयोगकर्ता रिपोर्ट, फीडबैक और मॉडरेशन कार्य एक्सपोर्ट करें',
    'export.exportConfiguration': 'एक्सपोर्ट कॉन्फ़िगरेशन',
    'export.startDate': 'प्रारंभ दिनांक',
    'export.endDate': 'समाप्ति दिनांक',
    'export.exportFormat': 'एक्सपोर्ट प्रारूप',
    'export.exportData': 'डेटा एक्सपोर्ट करें',
    'export.recentExports': 'हाल के एक्सपोर्ट',
    'export.download': 'डाउनलोड',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};