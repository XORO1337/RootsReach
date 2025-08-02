const express = require('express');
const router = express.Router();
const ArtisanDashboardController = require('../controllers/ArtisanDashboard_controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All routes require artisan authentication
router.use(authenticateToken);
router.use(authorizeRoles('artisan'));

// Dashboard statistics
router.get('/stats', ArtisanDashboardController.getDashboardStats);

// Analytics data
router.get('/analytics', ArtisanDashboardController.getAnalytics);

// Items/Products management
router.get('/items', ArtisanDashboardController.getArtisanItems);
router.post('/items', ArtisanDashboardController.createProduct);
router.put('/items/:productId', ArtisanDashboardController.updateProduct);
router.delete('/items/:productId', ArtisanDashboardController.deleteProduct);

// Orders management
router.get('/orders', ArtisanDashboardController.getArtisanOrders);
router.patch('/orders/:orderId/status', ArtisanDashboardController.updateOrderStatus);

module.exports = router;
