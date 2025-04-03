import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { corsOptions } from '../middleware/auth';
import { API_CONFIG } from '../config/constants';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
mongoose.connect(API_CONFIG.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Import and use other routes
import authRoutes from './routes/auth';
import productRoutes from './routes';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;