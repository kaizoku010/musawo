import express, { Request, Response } from 'express';
import { verifyToken, isAdmin } from '.././../middleware/auth';
import Order from '../models/Order';

const router = express.Router();

// Get all orders (admin only)
router.get('/all', [verifyToken, isAdmin], async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const orders = await Order.find({ user: req.user.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user exists in request
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if user is admin or order owner
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
    
    const order = new Order({
      user: req.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      total: items.reduce((acc: number, item: { price: number; quantity: number }) => acc + (item.price * item.quantity), 0)
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin only)
router.put('/:id/status', [verifyToken, isAdmin], async (req: Request, res: Res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




