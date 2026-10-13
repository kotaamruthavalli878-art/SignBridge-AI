import jwt from 'jsonwebtoken';
import { store } from '../services/store.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing. Please log in to access this resource.',
    });
  }

  const secret = process.env.JWT_SECRET || 'signbridge_dev_secret_key_894372985729357';

  try {
    const decoded = jwt.verify(token, secret);
    const user = await store.findUserById(decoded.userId || decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication session expired. Please log in again.',
      });
    }
    return res.status(403).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }
};
