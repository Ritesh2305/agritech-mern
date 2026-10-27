import { Response, NextFunction } from 'express';
import { Order } from '../models/Order.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { memoryStore } from '../state.ts';

// @desc    Get current farmer's orders
// @route   GET /api/v1/orders/my-orders
export async function getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (Order.db?.readyState === 1) {
      const orders = await Order.find({ user: req.user._id || req.user.id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const orders = memoryStore.orders.filter(
      (o: any) => o.userId === req.user.id || o.userId === req.user._id
    );
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}

// @desc    Get all orders across system (Admin only)
// @route   GET /api/v1/orders
export async function getAllOrders(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (Order.db?.readyState === 1) {
      const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email phone');
      return res.json({ success: true, count: orders.length, data: orders });
    }
    return res.json({ success: true, count: memoryStore.orders.length, data: memoryStore.orders });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single order by ID or orderNumber
// @route   GET /api/v1/orders/:id
export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Order.db?.readyState === 1) {
      const order = await Order.findById(id).populate('user', 'name email phone');
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }

    const order = memoryStore.orders.find((o: any) => o.id === id || o.orderNumber === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    return res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

// @desc    Place new agricultural input order
// @route   POST /api/v1/orders
export async function placeOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    const totalAmount = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
    const orderNumber = `AGT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (Order.db?.readyState === 1) {
      const order = await Order.create({
        user: req.user._id || req.user.id,
        orderNumber,
        items,
        totalAmount,
        status: 'pending',
        shippingAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        timeline: [
          {
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed by farmer through AgriTech portal.',
          },
        ],
      });
      return res.status(201).json({ success: true, data: order });
    }

    const newOrder = {
      id: `ord_${Date.now()}`,
      userId: req.user.id || req.user._id,
      orderNumber,
      items,
      totalAmount,
      status: 'pending' as const,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by farmer through AgriTech portal.',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    memoryStore.orders.unshift(newOrder);

    // Audit log
    memoryStore.activityLogs.unshift({
      id: `log_${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name || 'Farmer',
      userRole: 'farmer',
      action: 'Order Placed',
      entity: 'Orders',
      details: `Placed order ${orderNumber} worth ₹${totalAmount.toLocaleString('en-IN')}`,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    next(error);
  }
}

// @desc    Update order status in fulfillment pipeline (Admin only)
// @route   PATCH /api/v1/orders/:id/status
export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (Order.db?.readyState === 1) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.status = status;
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Order updated to ${status} by AgriTech administration.`,
      });
      await order.save();
      return res.json({ success: true, data: order });
    }

    const orderIdx = memoryStore.orders.findIndex((o: any) => o.id === id || o.orderNumber === id);
    if (orderIdx === -1) return res.status(404).json({ success: false, message: 'Order not found' });

    memoryStore.orders[orderIdx].status = status;
    memoryStore.orders[orderIdx].timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order updated to ${status} by AgriTech administration.`,
    });

    return res.json({ success: true, data: memoryStore.orders[orderIdx] });
  } catch (error) {
    next(error);
  }
}

// @desc    Cancel order
// @route   PATCH /api/v1/orders/:id/cancel
export async function cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (Order.db?.readyState === 1) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.status = 'rejected';
      order.timeline.push({
        status: 'rejected',
        timestamp: new Date(),
        note: reason || 'Cancelled by requester.',
      });
      await order.save();
      return res.json({ success: true, data: order });
    }

    const orderIdx = memoryStore.orders.findIndex((o: any) => o.id === id || o.orderNumber === id);
    if (orderIdx === -1) return res.status(404).json({ success: false, message: 'Order not found' });

    memoryStore.orders[orderIdx].status = 'rejected';
    memoryStore.orders[orderIdx].timeline.push({
      status: 'rejected',
      timestamp: new Date().toISOString(),
      note: reason || 'Cancelled by requester.',
    });

    return res.json({ success: true, data: memoryStore.orders[orderIdx] });
  } catch (error) {
    next(error);
  }
}
