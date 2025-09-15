import express from "express";
import pool from "../config/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-students", authenticateToken, async (req, res) => {
  try {
    const { semester } = req.query;
    let query = `SELECT * FROM students WHERE student_dept = ? AND student_programme = ? AND student_campus = ?`;
    const params = [req.user.dept, req.user.programme, req.user.campus];

    if (semester) {
      query += " AND semester = ?";
      params.push(semester);
    }

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      students: rows,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post(
  "/create-student",
  authenticateToken,
  requireRole(1),
  async (req, res) => {
    try {
      const { reg_no, student_name, semester, student_sec } = req.body;

      const insertQuery = `INSERT INTO students 
    (reg_no, student_name, semester, student_dept, student_sec, student_programme, student_campus)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

      await pool.query(insertQuery, [
        reg_no,
        student_name,
        semester,
        req.user.dept,
        student_sec,
        req.user.programme,
        req.user.campus,
      ]);

      res.status(201).json({ message: "Student created successfully" });
    } catch (err) {
      console.error("Error creating student:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/update-student/:reg_no",
  authenticateToken,
  requireRole(1),
  async (req, res) => {
    try {
      const { reg_no } = req.params;
      const { student_name, semester, student_sec } = req.body;

      const [studentCheck] = await pool.query(
        "SELECT * FROM students WHERE reg_no = ? AND student_dept = ? AND student_programme = ? AND student_campus = ?",
        [reg_no, req.user.dept, req.user.programme, req.user.campus]
      );

      if (studentCheck.length === 0) {
        return res
          .status(403)
          .json({ error: "You can only update students from your department" });
      }

      const [result] = await pool.execute(
        `UPDATE students SET student_name = ?, semester = ?, student_sec = ? WHERE reg_no = ?`,
        [student_name, semester, student_sec, reg_no]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json({ message: "Student updated successfully" });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/delete-student/:reg_no",
  authenticateToken,
  requireRole(1),
  async (req, res) => {
    try {
      const { reg_no } = req.params;

      const [studentCheck] = await pool.query(
        "SELECT * FROM students WHERE reg_no = ? AND student_dept = ? AND student_programme = ? AND student_campus = ?",
        [reg_no, req.user.dept, req.user.programme, req.user.campus]
      );

      if (studentCheck.length === 0) {
        return res
          .status(403)
          .json({ error: "You can only delete students from your department" });
      }

      const [result] = await pool.execute(
        "DELETE FROM students WHERE reg_no = ?",
        [reg_no]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
