const Order = require('../models/Orders');

class OrderService {
  // Create a new order
  static async createOrder(orderData) {
    try {
      const { buyer, items, shippingAddress, status = 'pending' } = orderData;

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const order = new Order({
        buyer,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          pricePerUnit: item.price,
          artisanId: item.artisanId
        })),
        totalAmount,
        shippingAddress,
        status,
        orderDate: new Date()
      });

      return await order.save();
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Get all orders with pagination
  static async getAllOrders(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      let query = {};

      if (filters.status) query.status = filters.status;
      if (filters.buyerId) query.buyer = filters.buyerId;
      if (filters.minAmount) query.totalAmount = { $gte: filters.minAmount };
      if (filters.maxAmount) {
        query.totalAmount = { ...query.totalAmount, $lte: filters.maxAmount };
      }

      const orders = await Order.find(query)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      const total = await Order.countDocuments(query);

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting all orders: ${error.message}`);
    }
  }

    // Get orders for a specific artisan
  static async getArtisanOrders(artisanId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({ 'items.artisanId': artisanId })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId');

      return orders;
    } catch (error) {
      throw new Error(`Error getting artisan orders: ${error.message}`);
    }
  }

  // Get orders for a specific distributor (buyer)
  static async getDistributorOrders(distributorId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({ buyer: distributorId })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      return orders;
    } catch (error) {
      throw new Error(`Error getting distributor orders: ${error.message}`);
    }
  }

  // Get order by ID
  static async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw new Error(`Error getting order: ${error.message}`);
    }
  }

  // Get order by number
  static async getOrderByNumber(orderNumber) {
    try {
      const order = await Order.findOne({ orderNumber })
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw new Error(`Error getting order by number: ${error.message}`);
    }
  }

  // Search orders
  static async searchOrders(searchParams, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      let query = {};

      if (searchParams.query) {
        const searchRegex = new RegExp(searchParams.query, 'i');
        query = {
          $or: [
            { 'items.productName': searchRegex },
            { status: searchRegex },
            { 'shippingAddress.city': searchRegex },
            { 'shippingAddress.state': searchRegex }
          ]
        };
      }

      if (searchParams.status) {
        query.status = searchParams.status;
      }

      if (searchParams.orderNumber) {
        query.orderNumber = searchParams.orderNumber;
      }

      const orders = await Order.find(query)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      const total = await Order.countDocuments(query);

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error searching orders: ${error.message}`);
    }
  }

  // Get total order amount (for analytics)
  static async getTotalOrderAmount(startDate, endDate) {
    try {
      let matchStage = {};
      
      if (startDate && endDate) {
        matchStage.orderDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const result = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      return { total: result[0]?.total || 0 };
    } catch (error) {
      throw new Error(`Error getting total order amount: ${error.message}`);
    }
  }

  // Get orders by date range
  static async getOrdersByDateRange(startDate, endDate, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      const total = await Order.countDocuments({
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting orders by date range: ${error.message}`);
    }
  }

  // Get order summary/analytics
  static async getOrderSummary(period = 'monthly') {
    try {
      const [
        totalOrders,
        totalAmount,
        ordersByStatus,
        recentOrders
      ] = await Promise.all([
        Order.countDocuments(),
        this.getTotalOrderAmount(),
        Order.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Order.find()
          .sort({ orderDate: -1 })
          .limit(5)
          .populate('buyer', 'name email')
          .populate('items.productId', 'name price')
      ]);

      return {
        totalOrders,
        totalAmount: totalAmount.total,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: curr.count
        }), {}),
        recentOrders
      };
    } catch (error) {
      throw new Error(`Error getting order summary: ${error.message}`);
    }
  }

  // Get orders by buyer
  static async getOrdersByBuyer(buyerId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({ buyer: buyerId })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      const total = await Order.countDocuments({ buyer: buyerId });

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting orders by buyer: ${error.message}`);
    }
  }

  // Get orders by status
  static async getOrdersByStatus(status, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({ status })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      const total = await Order.countDocuments({ status });

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting orders by status: ${error.message}`);
    }
  }

  // Update order
  static async updateOrder(orderId, updateData) {
    try {
      const order = await this.getOrderById(orderId);

      // Update allowed fields
      const allowedUpdates = ['status', 'shippingAddress'];
      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          order[field] = updateData[field];
        }
      });

      return await order.save();
    } catch (error) {
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      const order = await this.getOrderById(orderId);
      order.status = status;
      return await order.save();
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // Update shipping address
  static async updateShippingAddress(orderId, shippingAddress) {
    try {
      const order = await this.getOrderById(orderId);
      order.shippingAddress = shippingAddress;
      return await order.save();
    } catch (error) {
      throw new Error(`Error updating shipping address: ${error.message}`);
    }
  }

  // Add order item
  static async addOrderItem(orderId, itemData) {
    try {
      const order = await this.getOrderById(orderId);
      
      order.items.push({
        productId: itemData.productId,
        productName: itemData.productName,
        quantity: itemData.quantity,
        pricePerUnit: itemData.price,
        artisanId: itemData.artisanId
      });

      // Recalculate total amount
      order.totalAmount = order.items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);

      return await order.save();
    } catch (error) {
      throw new Error(`Error adding order item: ${error.message}`);
    }
  }

  // Update order item
  static async updateOrderItem(orderId, itemId, itemData) {
    try {
      const order = await this.getOrderById(orderId);
      const item = order.items.id(itemId);

      if (!item) {
        throw new Error('Order item not found');
      }

      // Update item fields
      Object.assign(item, itemData);

      // Recalculate total amount
      order.totalAmount = order.items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);

      return await order.save();
    } catch (error) {
      throw new Error(`Error updating order item: ${error.message}`);
    }
  }

  // Remove order item
  static async removeOrderItem(orderId, itemId) {
    try {
      const order = await this.getOrderById(orderId);
      order.items.pull(itemId);

      // Recalculate total amount
      order.totalAmount = order.items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);

      return await order.save();
    } catch (error) {
      throw new Error(`Error removing order item: ${error.message}`);
    }
  }

  // Delete order
  static async deleteOrder(orderId) {
    try {
      const order = await this.getOrderById(orderId);
      await order.deleteOne();
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }

  // Get order statistics
  static async getOrderStatistics(filters = {}) {
    try {
      let matchStage = {};
      
      if (filters.artisanId) matchStage['items.artisanId'] = filters.artisanId;
      if (filters.buyerId) matchStage.buyer = filters.buyerId;
      if (filters.startDate && filters.endDate) {
        matchStage.orderDate = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const statistics = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            statusBreakdown: {
              $push: '$status'
            }
          }
        }
      ]);

      return statistics[0] || {};
    } catch (error) {
      throw new Error(`Error getting order statistics: ${error.message}`);
    }
  }

  // Get recent orders
  static async getRecentOrders(days = 7, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await Order.find({
        orderDate: { $gte: startDate }
      })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('buyer', 'name email phone')
        .populate('items.productId')
        .populate('items.artisanId', 'name email phone');

      const total = await Order.countDocuments({
        orderDate: { $gte: startDate }
      });

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error getting recent orders: ${error.message}`);
    }
  }
}

module.exports = OrderService;
