import express from "express";
import pool from "../config/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import formatDateForMySQL, { getCurrentDateIST } from "../utils/formatDate.js";

const router = express.Router();

router.post(
  "/create-exam",
  authenticateToken,
  requireRole(1),
  async (req, res) => {
    try {
      const {
        course_code,
        exam_date,
        exam_type,
        exam_slot,
        start_time,
        end_time,
      } = req.body;
      const created_by = req.user.name || req.user.faculty_name || "Unknown";

      // Check if course belongs to coordinator's department
      const [courseCheck] = await pool.query(
        "SELECT * FROM courses WHERE course_code = ? AND course_dept = ? AND course_programme = ? AND course_campus = ?",
        [course_code, req.user.dept, req.user.programme, req.user.campus]
      );

      if (courseCheck.length === 0) {
        return res
          .status(403)
          .json({
            message: "You can only create exams for courses in your department",
          });
      }

      const formattedDate = formatDateForMySQL(exam_date);
      
      const insertQuery = `INSERT INTO exams 
        (course_code, exam_type, exam_date, exam_slot, start_time, end_time, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

      await pool.query(insertQuery, [
        course_code,
        exam_type,
        formattedDate,
        exam_slot,
        start_time,
        end_time,
        created_by,
      ]);

      res.status(201).json({ message: "Exam created successfully" });
    } catch (err) {
      console.log("Error creating exam: ", err);
      console.log("Request body:", req.body);
      console.log("User data:", req.user);
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  }
);

router.get("/get-exams", authenticateToken, async (req, res) => {
  try {
    const { semester } = req.query;
    let query = `SELECT e.* FROM exams e 
                 JOIN courses c ON e.course_code = c.course_code 
                 WHERE c.course_dept = ? AND c.course_programme = ? AND c.course_campus = ?`;
    const params = [req.user.dept, req.user.programme, req.user.campus];

    if (semester) {
      query += " AND c.course_semester = ?";
      params.push(semester);
    }

    const [rows] = await pool.query(query, params);
    const formattedExams = rows.map((exam) => ({
      ...exam,
      exam_date: exam.exam_date instanceof Date ? formatDateForMySQL(exam.exam_date) : exam.exam_date,
    }));
    res.json({
      success: true,
      exams: formattedExams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.delete(
  "/delete-exam/:course_code",
  authenticateToken,
  requireRole(1),
  async (req, res) => {
    try {
      const { course_code } = req.params;

      // Check if exam belongs to coordinator's department
      const [examCheck] = await pool.query(
        `SELECT e.* FROM exams e 
             JOIN courses c ON e.course_code = c.course_code 
             WHERE e.course_code = ? AND c.course_dept = ? AND c.course_programme = ? AND c.course_campus = ?`,
        [course_code, req.user.dept, req.user.programme, req.user.campus]
      );

      if (examCheck.length === 0) {
        return res
          .status(403)
          .json({ error: "You can only delete exams from your department" });
      }

      const [result] = await pool.execute(
        "DELETE FROM exams WHERE course_code = ?",
        [course_code]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Exam not found" });
      }

      res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      console.error("Error deleting exam:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/update-exam/:course_code",
  authenticateToken,
  requireRole(1),
  async (req, res) => {
    try {
      const { course_code } = req.params;
      const { exam_date, exam_type, exam_slot, start_time, end_time } =
        req.body;

      // Check if exam belongs to coordinator's department
      const [examCheck] = await pool.query(
        `SELECT e.* FROM exams e 
             JOIN courses c ON e.course_code = c.course_code 
             WHERE e.course_code = ? AND c.course_dept = ? AND c.course_programme = ? AND c.course_campus = ?`,
        [course_code, req.user.dept, req.user.programme, req.user.campus]
      );

      if (examCheck.length === 0) {
        return res
          .status(403)
          .json({ error: "You can only update exams from your department" });
      }

      // Format date for MySQL
      const formattedDate = formatDateForMySQL(exam_date);

      // Delete existing seating arrangements for this exam
      await pool.execute("DELETE FROM seating WHERE exam = ?", [
        `${course_code}_${examCheck[0].exam_date}`,
      ]);

      const [result] = await pool.execute(
        `UPDATE exams SET exam_type = ?, exam_date = ?, exam_slot = ?, start_time = ?, end_time = ? WHERE course_code = ?`,
        [exam_type, formattedDate, exam_slot, start_time, end_time, course_code]
      );

      // If date changed, also delete seating for new date
      if (formattedDate !== examCheck[0].exam_date) {
        await pool.execute("DELETE FROM seating WHERE exam = ?", [
          `${course_code}_${formattedDate}`,
        ]);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Exam not found" });
      }

      res.json({ message: "Exam updated successfully" });
    } catch (error) {
      console.error("Error updating exam:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
