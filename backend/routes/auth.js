import express from 'express';
import pool from '../config/database.js'
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { generateTokens, saveRefreshToken, validateRefreshToken, deleteRefreshToken, deleteUserRefreshTokens, blacklistToken } from '../utils/tokenUtils.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ message: 'User ID and password are required' });
  }

  try {
    
    const [rows] = await pool.query(`
      SELECT fu.user_id, fu.password, fu.role,
             f.faculty_name, f.faculty_dept, f.faculty_programme, f.faculty_campus
      FROM faculty_users fu
      JOIN faculty f ON fu.user_id = f.emp_id
      WHERE fu.user_id = ?
    `, [user_id]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password.trim(), user.password.trim());
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    await saveRefreshToken(user.user_id, refreshToken);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.user_id,
        name: user.faculty_name,
        dept: user.faculty_dept,
        programme: user.faculty_programme,
        campus: user.faculty_campus,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }
  
  try {
    const tokenData = await validateRefreshToken(refreshToken);
    
    if (!tokenData) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    
    // Get user data
    const [rows] = await pool.query(`
      SELECT fu.user_id, fu.role,
             f.faculty_name, f.faculty_dept, f.faculty_programme, f.faculty_campus
      FROM faculty_users fu
      JOIN faculty f ON fu.user_id = f.emp_id
      WHERE fu.user_id = ?
    `, [tokenData.user_id]);
    
    if (rows.length === 0) {
      await deleteRefreshToken(refreshToken);
      return res.status(401).json({ message: 'User not found' });
    }
    
    const user = rows[0];
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    // Delete old refresh token and save new one
    await deleteRefreshToken(refreshToken);
    await saveRefreshToken(user.user_id, newRefreshToken);
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  
  try {
    // Blacklist access token if provided
    // Note: Using jwt.decode() (not verify) to extract jti/exp for blacklisting
    // This is safe since we only use it for invalidation, not authentication
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded && decoded.jti && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        await blacklistToken(decoded.jti, expiresAt);
      }
    }
    
    // Delete hashed refresh token
    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with logout even if blacklisting fails
  }
  
  res.json({ message: 'Logout successful' });
});

router.post('/logout-all', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }
  
  try {
    const deletedTokens = await deleteUserRefreshTokens(userId);
    
    res.json({ 
      message: 'Logged out from all devices',
      note: 'Existing access tokens remain valid for up to 15 minutes',
      refreshTokensInvalidated: deletedTokens
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
