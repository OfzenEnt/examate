import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get("/get-faculty", authenticateToken, requireRole(1), async (req, res) => {
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


router.post("/invigilator-assignment/:room_id/:block", authenticateToken, requireRole(1), async(req,res)=>{
    const { room_id, block } = req.params;
    const { invigilator_id } = req.body;
    
    if (!invigilator_id) {
        return res.status(400).json({ error: 'invigilator_id is required' });
    }
    
    try {
        const query = `UPDATE seating SET invigilator_id = ? WHERE room_id = ? AND block = ?`;
        const [result] = await pool.execute(query, [invigilator_id, room_id, block]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Seating record not found' });
        }
        
        res.json({ success: true, message: 'Invigilator assigned successfully' });
    } catch (error) {
        console.error('Error assigning invigilator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;