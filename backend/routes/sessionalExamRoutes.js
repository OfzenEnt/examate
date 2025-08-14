import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post("/eligibles", authenticateToken, requireRole(1), async(req, res)=>{
    const { course_code } = req.body;
    
    if (!course_code) {
        return res.status(400).json({ error: 'course_code is required' });
    }
    
    try {
        // Get course details to find semester and campus
        const [courseRows] = await pool.query(
            'SELECT course_semester, course_campus FROM courses WHERE course_code = ?',
            [course_code]
        );
        
        if (courseRows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        const { course_semester, course_campus } = courseRows[0];
        
        // Get students for this semester
        const [students] = await pool.query(
            'SELECT * FROM students WHERE semester = ? AND student_campus = ? AND seat_assigned IS NULL',
            [course_semester, course_campus]
        );

        // Get available rooms in the campus
        const [rooms] = await pool.query(
            `SELECT r.*, b.campus_alias 
             FROM rooms r 
             JOIN blocks b ON r.block_alias = b.block_alias 
             WHERE b.campus_alias = ? AND r.room_status = 0`,
            [course_campus]
        );
        
        res.json({
            success: true,
            course_code,
            semester: course_semester,
            campus: course_campus,
            students,
            available_rooms: rooms
        });
        
    } catch (error) {
        console.error('Error allocating room for exam:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


 


router.post
export default router;