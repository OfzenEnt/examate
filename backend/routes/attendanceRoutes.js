import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.post("/mark-attendance", async(req, res)=>{
    const {studentsList} = req.body;
    
    if (!studentsList || !Array.isArray(studentsList)) {
        return res.status(400).json({ error: 'studentsList array is required' });
    }
    
    try {
        for (let student of studentsList) {
            await pool.query(`UPDATE students SET attendence = ? WHERE reg_no = ?`, ["present", student]);
        }
        
        res.json({ 
            success: true, 
            message: 'Attendance marked successfully',
            studentsMarked: studentsList.length 
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



export default router;