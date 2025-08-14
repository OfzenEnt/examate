import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get("/get-students", authenticateToken, async (req, res) => {
    try {
        let query = 'SELECT * FROM students WHERE 1=1';
        const params = [];

        if (req.query.semester) {
            query += ' AND semester = ?';
            params.push(req.query.semester);
        }

        if (req.query.student_sec) {
            query += ' AND student_sec = ?';
            params.push(req.query.student_sec);
        }

        if (req.query.student_dept) {
            query += ' AND student_dept = ?';
            params.push(req.query.student_dept);
        }

        if (req.query.student_programme) {
            query += ' AND student_programme = ?';
            params.push(req.query.student_programme);
        }

        if (req.query.student_campus) {
            query += ' AND student_campus = ?';
            params.push(req.query.student_campus);
        }

        if (req.query.student_attendance) {
            query += ' AND student_attendance = ?';
            params.push(req.query.student_attendance);
        }

        if (req.query.student_seat) {
            query += ' AND student_seat = ?';
            params.push(req.query.student_seat);
        }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, students: rows });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/get-students/:reg_no", authenticateToken, async (req, res) => {
    const { reg_no } = req.params;
    
    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE reg_no = ?', [reg_no]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json({ success: true, student: rows[0] });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;