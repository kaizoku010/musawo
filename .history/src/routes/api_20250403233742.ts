import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = express.Router();
import {
  getProducts,
  createProduct,
  getProduct,
  createOrder,
  getOrder,
  getUser,
  updateProduct,
  deleteProduct,
  getOrders,
  getAllUsers,
  getAnalytics
} from "../services/api";

// Export them if needed
export {
  getProducts,
  createProduct,
  getProduct,
  createOrder,
  getOrder,
  getUser,
  updateProduct,
  deleteProduct,
  getOrders,
  getAllUsers,
  getAnalytics
};

// Public routes (accessible by store frontend)
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// Protected routes (requires login)
router.use(verifyToken);
router.post('/orders', createOrder);
router.get('/orders/:id', getOrder);
router.get('/user/profile', getUser);

// Admin-only routes (requires admin role)
router.use(isAdmin);
router.post('/products', productService.create);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders/all', getOrders);
router.get('/users/all', getAllUsers);
router.get('/analytics', getAnalytics);

export default router;

