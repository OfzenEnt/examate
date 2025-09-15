import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();



router.post("/invigilator-assignment", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { course_code, exam_date } = req.body;
    
    // Get rooms allocated for this exam
    const [allocatedRooms] = await pool.query(
      `SELECT DISTINCT room_id FROM seating 
       WHERE exam = ?`,
      [`${course_code}_${exam_date}`]
    );

    if (allocatedRooms.length === 0) {
      return res.status(400).json({ error: 'No seating arrangement found. Please arrange seating first.' });
    }

    // Get available faculty
    const [faculty] = await pool.query(
      `SELECT * FROM faculty 
       WHERE faculty_dept = ? AND faculty_programme = ? AND faculty_campus = ?`,
      [req.user.dept, req.user.programme, req.user.campus]
    );

    if (faculty.length < allocatedRooms.length) {
      return res.status(400).json({ error: 'Not enough faculty available for invigilator assignment' });
    }

    // Assign invigilators to rooms
    let assignments = [];
    for (let i = 0; i < allocatedRooms.length; i++) {
      const room = allocatedRooms[i];
      const invigilator = faculty[i % faculty.length];
      
      await pool.execute(
        `UPDATE seating SET invigilator_id = ? WHERE room_id = ? AND exam = ?`,
        [invigilator.emp_id, room.room_id, `${course_code}_${exam_date}`]
      );
      
      assignments.push({
        room_id: room.room_id,
        invigilator: invigilator.faculty_name,
        emp_id: invigilator.emp_id
      });
    }

    res.json({
      success: true,
      message: 'Invigilator assignment completed',
      assignments: assignments
    });

  } catch (error) {
    console.error('Error in invigilator assignment:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;