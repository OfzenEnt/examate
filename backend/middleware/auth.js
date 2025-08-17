import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/tokenUtils.js';
import dotenv from 'dotenv';

dotenv.config({"override": true})

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is blacklisted
    if (decoded.jti && await isTokenBlacklisted(decoded.jti)) {
      return res.status(401).json({ message: 'Token has been invalidated' });
    }
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export { authenticateToken, requireRole };
