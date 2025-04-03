import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/db', (_, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: {
        state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'disconnected', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
