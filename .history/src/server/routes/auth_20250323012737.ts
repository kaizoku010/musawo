import express from 'express';
import { DEFAULT_ADMIN } from '../../config/constants';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // For development, accept default admin credentials
    if (email === DEFAULT_ADMIN.email && password === 'admin123') {
      const token = jwt.sign(
        { id: DEFAULT_ADMIN.id, role: DEFAULT_ADMIN.role },
        'your-secret-key', // Replace with actual secret from env
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        user: DEFAULT_ADMIN
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/validate', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
