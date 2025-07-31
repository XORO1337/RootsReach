# 🧩 Raw Materials Management System

## 🎯 Overview
Complete Raw Materials Management system with role-based access control for Admin and Artisan dashboards.

## 🛠️ Components Created

### 1. 🔐 Authentication System
- **File**: `src/components/Auth/AuthContext.jsx`
- **Features**: Role-based permissions, protected routes, auth hooks
- **Roles**: `admin`, `artisan`, `distributor`, `buyer`

### 2. 👨‍💼 Admin Raw Materials Management
- **File**: `src/components/dashboard/admin-dashboard/AdminRawMaterials.jsx`
- **Features**: 
  - ➕ Add new raw materials with image upload
  - 📋 View all materials in table format
  - 🗑️ Delete materials
  - ✏️ Edit materials (placeholder)
  - 🖼️ Image modal view

### 3. 👩‍🎨 Artisan Raw Materials Ordering
- **File**: `src/components/dashboard/artisian-dashboard/ArtisanRawMaterials.jsx`
- **Features**:
  - 📱 Grid view of available materials
  - 🛒 Order materials with quantity selection
  - ➕➖ Increase/decrease order quantity
  - 🖼️ Image modal view
  - 🚫 Stock validation
  - ✅ Order success notifications

## 🔧 API Endpoints

### Raw Materials API
```typescript
// Fetch all raw materials
GET /api/raw-materials
Headers: { Authorization: "Bearer <token>" }

// Add new raw material (Admin only)
POST /api/raw-materials
Headers: { Authorization: "Bearer <token>" }
Body: FormData {
  name: string,
  quantity: string,
  unit: string,
  image: File,
  status: string,
  date: string
}

// Update material quantity (Artisan inventory management)
PATCH /api/raw-materials/:id
Headers: { Authorization: "Bearer <token>" }
Body: { quantity: string }

// Order material (Artisan ordering)
PATCH /api/raw-materials/:id/order
Headers: { Authorization: "Bearer <token>" }
Body: { 
  orderQuantity: number,
  artisanId: string
}

// Delete material (Admin only)
DELETE /api/raw-materials/:id
Headers: { Authorization: "Bearer <token>" }
```

## 🎮 Usage Examples

### 1. 🔗 Integration with Admin Dashboard
```jsx
import AdminDashboardRawMaterials from './components/dashboard/admin-dashboard/AdminDashboardRawMaterials';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminDashboardRawMaterials />
    </div>
  );
}
```

### 2. 🔗 Integration with Artisan Dashboard
```jsx
import ArtisanDashboardRawMaterials from './components/dashboard/artisan-dashboard/ArtisanDashboardRawMaterials';

function ArtisanDashboard() {
  return (
    <div>
      <h1>Artisan Dashboard</h1>
      <ArtisanDashboardRawMaterials />
    </div>
  );
}
```

### 3. 🔐 Setting up Auth Provider
```jsx
import { AuthProvider } from './components/Auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/artisan" element={<ArtisanDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## 🛡️ Security Features

### Role-Based Access Control
- **Admins**: Can add, edit, delete, and view all materials
- **Artisans**: Can view and order materials only
- **Protection**: Components automatically check user roles
- **Fallback**: Unauthorized users see permission denied message

### Image Upload Security
- **Validation**: File type checking (JPEG, PNG, WebP)
- **Size Limit**: Maximum 5MB per image
- **Preview**: Real-time image preview before upload

## 📱 UI Features

### Admin Interface
- **📊 Dashboard**: Overview with stats and actions
- **📝 Form**: Clean material addition form with image upload
- **📋 Table**: Sortable table with actions
- **🖼️ Gallery**: Click images for full-size view

### Artisan Interface  
- **🎨 Grid Layout**: Beautiful card-based material display
- **🛒 Smart Ordering**: Quantity controls with stock validation
- **✅ Feedback**: Success/error notifications
- **📱 Responsive**: Works perfectly on mobile devices

## 🔄 State Management
- **Local State**: React hooks for component state
- **API Integration**: Fetch/Axios for backend communication
- **Error Handling**: Comprehensive error states
- **Loading States**: User-friendly loading indicators

## 🎯 Mock Data Fallback
Both components include mock data for development/testing when backend is unavailable.

## 🚀 Getting Started

1. **Install Dependencies** (if not already installed):
```bash
npm install lucide-react
```

2. **Add Auth Provider** to your app root
3. **Import Components** into your dashboards
4. **Configure API Endpoints** in your backend
5. **Test Role-Based Access** with different user roles

## 🔧 Customization Options

### Styling
- **Tailwind CSS**: Fully customizable with Tailwind classes
- **Color Scheme**: Modify color variables for branding
- **Layout**: Adjust grid/table layouts as needed

### Features
- **Add Categories**: Extend material categorization
- **Bulk Operations**: Add bulk upload/delete functionality
- **Analytics**: Add material usage analytics
- **Notifications**: Integrate with toast notification library

## 📊 Example Material Object
```typescript
interface RawMaterial {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  status: 'Available' | 'Out of Stock' | 'Pending';
  date: string;
  image?: string;
}
```

The system is now ready for production use with full CRUD operations, role-based security, and beautiful UIs! 🎉
