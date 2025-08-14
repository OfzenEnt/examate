import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get("/get-faculty", authenticateToken, async (req, res) => {
    try {
        let query = 'SELECT * FROM faculty WHERE 1=1';
        const params = [];

        if (req.query.faculty_dept) {
            query += ' AND faculty_dept = ?';
            params.push(req.query.faculty_dept);
        }

        if (req.query.faculty_programme) {
            query += ' AND faculty_programme = ?';
            params.push(req.query.faculty_programme);
        }

        if (req.query.faculty_campus) {
            query += ' AND faculty_campus = ?';
            params.push(req.query.faculty_campus);
        }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, faculty: rows });
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;