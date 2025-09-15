import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get("/exam-seating/:course_code/:exam_date", authenticateToken, async (req, res) => {
  try {
    const { course_code, exam_date } = req.params;
    const examKey = `${course_code}_${exam_date}`;
    
    const [seatingData] = await pool.query(
      `SELECT s.*, f.faculty_name as invigilator_name 
       FROM seating s 
       LEFT JOIN faculty f ON s.invigilator_id = f.emp_id 
       WHERE s.exam = ?`,
      [examKey]
    );

    // Parse student lists and get student details
    const seatingWithStudents = await Promise.all(
      seatingData.map(async (seat) => {
        let studentIds = [];
        try {
          if (Array.isArray(seat.student_list)) {
            studentIds = seat.student_list;
          } else if (typeof seat.student_list === 'string') {
            studentIds = JSON.parse(seat.student_list);
          } else {
            studentIds = [];
          }
        } catch (error) {
          studentIds = [];
        }
        
        if (studentIds.length > 0) {
          const placeholders = studentIds.map(() => '?').join(',');
          const [students] = await pool.query(
            `SELECT reg_no, student_name FROM students WHERE reg_no IN (${placeholders})`,
            studentIds
          );
          
          return {
            ...seat,
            student_count: studentIds.length,
            students: students
          };
        }
        
        return {
          ...seat,
          student_count: 0,
          students: []
        };
      })
    );

    res.json({
      success: true,
      seating: seatingWithStudents
    });

  } catch (error) {
    console.error('Error fetching exam seating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;