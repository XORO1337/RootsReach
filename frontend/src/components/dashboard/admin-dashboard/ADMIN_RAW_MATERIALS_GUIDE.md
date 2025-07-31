# 📍 Admin Raw Materials Access Guide

## 🎯 **Where Can Admin Add and Manage Raw Materials?**

### **📍 Location: Admin Dashboard → Raw Materials Tab**

```
🏠 Admin Dashboard
├── 📊 Overview
├── 👥 Users  
├── 📦 Products
├── 🧩 Raw Materials  ← **HERE!**
├── 🛒 Orders
└── ⚙️ Settings
```

## 🚀 **Step-by-Step Access Instructions**

### **1. 🔐 Login as Admin**
- Go to: `http://localhost:5176/admin-dashboard`
- Make sure you're logged in with admin credentials
- Role must be `admin` in your user account

### **2. 📍 Navigate to Raw Materials**
- Look for the **"Raw Materials"** tab in the top navigation
- Click on the **"Raw Materials"** tab
- You'll see the complete Raw Materials Management interface

### **3. ➕ Add New Raw Materials**
- Click the **"Add Material"** button (top-right corner)
- Fill out the form:
  - **Material Name**: e.g., "Organic Cotton Yarn"
  - **Quantity**: e.g., "100"
  - **Unit**: Select from dropdown (kg, g, lbs, yards, meters)
  - **Image**: Upload material photo (max 5MB, PNG/JPG/WebP)
- Click **"Add Raw Material"** to save

### **4. 📋 Manage Existing Materials**
- View all materials in the table
- **🖼️ Click images** for full-size view
- **✏️ Edit** materials (functionality placeholder)
- **🗑️ Delete** materials with confirmation

## 🎮 **Admin Interface Features**

### **📊 Dashboard Overview**
```
┌─────────────────────────────────────────────────────────────┐
│  🧩 Raw Materials Management                    [Add Material] │
├─────────────────────────────────────────────────────────────┤
│  Manage inventory and add new materials                     │
└─────────────────────────────────────────────────────────────┘
```

### **➕ Add Material Form**
```
┌──────────────────┬──────────────────┐
│ Material Name*   │ Image Preview    │
│ [Text Input]     │ [Upload Area]    │
│                  │                  │
│ Quantity*   Unit │ [Image Preview]  │
│ [Number] [Select]│                  │
│                  │                  │
│ Image Upload*    │                  │
│ [File Upload]    │                  │
│                  │                  │
│ [Add Raw Material Button]           │
└──────────────────┴──────────────────┘
```

### **📋 Materials List**
```
┌──────┬────────────────────┬──────────┬──────┬────────────┬─────────┐
│ Image│ Material           │ Quantity │ Unit │ Status     │ Actions │
├──────┼────────────────────┼──────────┼──────┼────────────┼─────────┤
│ 🖼️  │ Organic Cotton Yarn│ 25       │ kg   │ ✅Available │ ✏️ 🗑️  │
│ 🖼️  │ Natural Wool       │ 15       │ kg   │ ✅Available │ ✏️ 🗑️  │
│ 🖼️  │ Bamboo Fiber       │ 30       │ kg   │ ✅Available │ ✏️ 🗑️  │
└──────┴────────────────────┴──────────┴──────┴────────────┴─────────┘
```

## 🔧 **Admin-Only Features**

### **✅ What Admins Can Do:**
- ➕ **Add** new raw materials with images
- 📋 **View** all materials in organized table
- 🗑️ **Delete** materials with confirmation
- ✏️ **Edit** materials (feature ready for implementation)
- 🖼️ **Manage** material images and details
- 📊 **Monitor** inventory levels

### **🚫 What Admins Cannot Do:**
- ❌ Order materials (that's for artisans)
- ❌ Place individual orders (admin manages supply)

## 🛡️ **Security & Permissions**

### **🔐 Access Control:**
- Only users with `role: 'admin'` can access
- Protected by authentication middleware
- Unauthorized users see "Access Denied" message

### **🛡️ API Endpoints (Admin Only):**
```javascript
POST   /api/raw-materials        // Add new material
DELETE /api/raw-materials/:id    // Delete material
PATCH  /api/raw-materials/:id    // Edit material (coming soon)
```

## 📱 **Mobile-Friendly Interface**

The admin interface is fully responsive and works perfectly on:
- 💻 **Desktop**: Full table view with all features
- 📱 **Tablet**: Responsive grid layout
- 📱 **Mobile**: Touch-friendly interface

## 🎯 **Quick Start for Admins**

1. **Login**: Go to `/admin-dashboard`
2. **Navigate**: Click "Raw Materials" tab
3. **Add**: Click "Add Material" button
4. **Fill Form**: Enter material details + upload image
5. **Save**: Click "Add Raw Material"
6. **Manage**: View/edit/delete from the table

## 📞 **Support**

If you need help:
- Check the browser console for any errors
- Ensure you're logged in as an admin
- Verify your role permissions
- Contact development team for backend API issues

---

**🎉 You now have complete control over Raw Materials management from the Admin Dashboard!**
