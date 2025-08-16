import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js'
import bcrypt from 'bcrypt'; 
import dotenv from 'dotenv';
dotenv.config({'override': true});

console.log("JWT_SECRET:", process.env.JWT_SECRET); 

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

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
        name: user.faculty_name,
        dept: user.faculty_dept,
        programme: user.faculty_programme,
        campus: user.faculty_campus
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
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


export default router;
