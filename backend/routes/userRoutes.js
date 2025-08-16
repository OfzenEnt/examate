import express from 'express';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Faculty Users CRUD
router.post("/create-faculty-user", authenticateToken, requireRole(1), async (req, res) => {
    const { user_id, password, role } = req.body;
    
    if (!user_id || !password || role === undefined) {
        return res.status(400).json({ error: 'user_id, password, and role are required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
            'INSERT INTO faculty_users (user_id, password, role) VALUES (?, ?, ?)',
            [user_id, hashedPassword, role]
        );
        res.status(201).json({ message: 'Faculty user created successfully' });
    } catch (error) {
        console.error('Error creating faculty user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/get-faculty-users", authenticateToken, requireRole(1), async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT user_id, role, created_at FROM faculty_users');
        res.json({ success: true, faculty_users: rows });
    } catch (error) {
        console.error('Error fetching faculty users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put("/update-faculty-user/:user_id", authenticateToken, requireRole(1), async (req, res) => {
    const { user_id } = req.params;
    const { password, role } = req.body;
    
    try {
        let query = 'UPDATE faculty_users SET ';
        const params = [];
        const updates = [];
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }
        
        if (role !== undefined) {
            updates.push('role = ?');
            params.push(role);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        query += updates.join(', ') + ' WHERE user_id = ?';
        params.push(user_id);
        
        const [result] = await pool.execute(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Faculty user not found' });
        }
        
        res.json({ message: 'Faculty user updated successfully' });
    } catch (error) {
        console.error('Error updating faculty user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/delete-faculty-user/:user_id", authenticateToken, requireRole(1), async (req, res) => {
    const { user_id } = req.params;
    
    try {
        const [result] = await pool.execute('DELETE FROM faculty_users WHERE user_id = ?', [user_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Faculty user not found' });
        }
        
        res.json({ message: 'Faculty user deleted successfully' });
    } catch (error) {
        console.error('Error deleting faculty user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// EC Users CRUD
router.post("/create-ec-user", authenticateToken, requireRole(3), async (req, res) => {
    const { user_id, name, campus, password, role } = req.body;
    
    if (!user_id || !name || !campus || !password || role === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
            'INSERT INTO ec_users (user_id, name, campus, password, role) VALUES (?, ?, ?, ?, ?)',
            [user_id, name, campus, hashedPassword, role]
        );
        res.status(201).json({ message: 'EC user created successfully' });
    } catch (error) {
        console.error('Error creating EC user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/get-ec-users", authenticateToken, requireRole(3), async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT user_id, name, campus, role FROM ec_users');
        res.json({ success: true, ec_users: rows });
    } catch (error) {
        console.error('Error fetching EC users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put("/update-ec-user/:user_id", authenticateToken, requireRole(3), async (req, res) => {
    const { user_id } = req.params;
    const { name, campus, password, role } = req.body;
    
    try {
        let query = 'UPDATE ec_users SET ';
        const params = [];
        const updates = [];
        
        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        
        if (campus) {
            updates.push('campus = ?');
            params.push(campus);
        }
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }
        
        if (role !== undefined) {
            updates.push('role = ?');
            params.push(role);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        query += updates.join(', ') + ' WHERE user_id = ?';
        params.push(user_id);
        
        const [result] = await pool.execute(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'EC user not found' });
        }
        
        res.json({ message: 'EC user updated successfully' });
    } catch (error) {
        console.error('Error updating EC user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/delete-ec-user/:user_id", authenticateToken, requireRole(3), async (req, res) => {
    const { user_id } = req.params;
    
    try {
        const [result] = await pool.execute('DELETE FROM ec_users WHERE user_id = ?', [user_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'EC user not found' });
        }
        
        res.json({ message: 'EC user deleted successfully' });
    } catch (error) {
        console.error('Error deleting EC user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;