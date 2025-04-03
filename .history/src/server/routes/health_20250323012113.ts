import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/db', async (req, res) => {
  try {
    const status = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ status });
  } catch (error) {
    res.status(500).json({ status: 'disconnected', error: error.message });
  }
});

export default router;