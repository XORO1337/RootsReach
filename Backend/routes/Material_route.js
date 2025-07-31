const express = require('express');
const MaterialController = require('../controllers/Material_controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Create material (Admin only) - with image upload
router.post('/', authorizeRoles('admin'), uploadSingle, MaterialController.createMaterial);

// Get all materials (Authenticated users)
router.get('/', MaterialController.getAllMaterials);

// Get materials by category
router.get('/category/:category', MaterialController.getMaterialsByCategory);

// Get materials by supplier
router.get('/supplier/:supplierId', MaterialController.getMaterialsBySupplier);

// Get low stock materials
router.get('/inventory/low-stock', MaterialController.getLowStockMaterials);

// Search materials
router.get('/search/materials', MaterialController.searchMaterials);

// Get material categories
router.get('/categories/all', MaterialController.getMaterialCategories);

// Get material by ID (must come after specific routes)
router.get('/:id', MaterialController.getMaterialById);

// Update material by ID (Admin only)
router.put('/:id', authorizeRoles('admin'), MaterialController.updateMaterial);

// Delete material by ID (Admin only)
router.delete('/:id', authorizeRoles('admin'), MaterialController.deleteMaterial);

// Update material stock (Authenticated users)
router.patch('/:id/stock', MaterialController.updateMaterialStock);

module.exports = router;