import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get("/get-courses", authenticateToken, async (req, res) => {
  try {
    const { semester } = req.query;
    let query = `SELECT * FROM courses WHERE course_dept = ? AND course_programme = ? AND course_campus = ?`;
    const params = [req.user.dept, req.user.programme, req.user.campus];

    if (semester) {
      query += " AND course_semester = ?";
      params.push(semester);
    }

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      courses: rows
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/create-course", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { course_code, course_name, course_semester } = req.body;
    
    const insertQuery = `INSERT INTO courses 
    (course_code, course_name, course_semester, course_dept, course_programme, course_campus)
    VALUES (?, ?, ?, ?, ?, ?)`;

    await pool.query(insertQuery, [
      course_code, course_name, course_semester, req.user.dept, req.user.programme, req.user.campus
    ]);

    res.status(201).json({ message: "Course created successfully" });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-course/:course_code", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { course_code } = req.params;
    const { course_name, course_semester } = req.body;
    
    const [courseCheck] = await pool.query(
      'SELECT * FROM courses WHERE course_code = ? AND course_dept = ? AND course_programme = ? AND course_campus = ?',
      [course_code, req.user.dept, req.user.programme, req.user.campus]
    );
    
    if (courseCheck.length === 0) {
      return res.status(403).json({ error: 'You can only update courses from your department' });
    }
    
    const [result] = await pool.execute(
      `UPDATE courses SET course_name = ?, course_semester = ? WHERE course_code = ?`,
      [course_name, course_semester, course_code]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete("/delete-course/:course_code", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { course_code } = req.params;
    
    const [courseCheck] = await pool.query(
      'SELECT * FROM courses WHERE course_code = ? AND course_dept = ? AND course_programme = ? AND course_campus = ?',
      [course_code, req.user.dept, req.user.programme, req.user.campus]
    );
    
    if (courseCheck.length === 0) {
      return res.status(403).json({ error: 'You can only delete courses from your department' });
    }
    
    const [result] = await pool.execute('DELETE FROM courses WHERE course_code = ?', [course_code]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;