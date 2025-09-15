import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get("/get-faculty", authenticateToken, async (req, res) => {
  try {
    const query = `SELECT * FROM faculty WHERE faculty_dept = ? AND faculty_programme = ? AND faculty_campus = ?`;
    const params = [req.user.dept, req.user.programme, req.user.campus];

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      faculty: rows
    });

  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/create-faculty", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { emp_id, faculty_name, faculty_email, faculty_phone } = req.body;
    
    const insertQuery = `INSERT INTO faculty 
    (emp_id, faculty_name, faculty_email, faculty_phone, faculty_dept, faculty_programme, faculty_campus)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await pool.query(insertQuery, [
      emp_id, faculty_name, faculty_email, faculty_phone, req.user.dept, req.user.programme, req.user.campus
    ]);

    res.status(201).json({ message: "Faculty created successfully" });
  } catch (err) {
    console.error("Error creating faculty:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-faculty/:emp_id", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { emp_id } = req.params;
    const { faculty_name, faculty_email, faculty_phone } = req.body;
    
    const [facultyCheck] = await pool.query(
      'SELECT * FROM faculty WHERE emp_id = ? AND faculty_dept = ? AND faculty_programme = ? AND faculty_campus = ?',
      [emp_id, req.user.dept, req.user.programme, req.user.campus]
    );
    
    if (facultyCheck.length === 0) {
      return res.status(403).json({ error: 'You can only update faculty from your department' });
    }
    
    const [result] = await pool.execute(
      `UPDATE faculty SET faculty_name = ?, faculty_email = ?, faculty_phone = ? WHERE emp_id = ?`,
      [faculty_name, faculty_email, faculty_phone, emp_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.json({ message: 'Faculty updated successfully' });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete("/delete-faculty/:emp_id", authenticateToken, requireRole(1), async (req, res) => {
  try {
    const { emp_id } = req.params;
    
    const [facultyCheck] = await pool.query(
      'SELECT * FROM faculty WHERE emp_id = ? AND faculty_dept = ? AND faculty_programme = ? AND faculty_campus = ?',
      [emp_id, req.user.dept, req.user.programme, req.user.campus]
    );
    
    if (facultyCheck.length === 0) {
      return res.status(403).json({ error: 'You can only delete faculty from your department' });
    }
    
    const [result] = await pool.execute('DELETE FROM faculty WHERE emp_id = ?', [emp_id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;