import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get("/get-faculty", authenticateToken, requireRole(1), async (req, res) => {
    try {
        const query = `SELECT f.* FROM faculty f 
                       JOIN faculty_users fu ON f.emp_id = fu.user_id 
                       WHERE fu.role != 1
                       AND f.faculty_dept = ? 
                       AND f.faculty_programme = ? 
                       AND f.faculty_campus = ?`;
        
        const [rows] = await pool.query(query, [req.user.dept, req.user.programme, req.user.campus]);
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
    } 
    catch (error) {
        console.error('Error assigning invigilator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;