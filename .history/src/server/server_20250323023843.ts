import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import healthRoutes from './routes/health';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Production-ready CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:8080', // Alternative local port
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Basic root route
app.get('/', (req, res) => {
  res.json({ message: 'Sembeza API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

// Connect to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, mongooseOptions);
    console.log('MongoDB Connected Successfully');
    
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();

export default app;