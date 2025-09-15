import express from "express";
import pool from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";
import formatDateForMySQL from "../utils/formatDate.js";

const router = express.Router();

router.get("/my-invigilations", authenticateToken, async (req, res) => {
  try {
    // Get seating records for the invigilator
    const [seatingRecords] = await pool.query(
      'SELECT *, SUBSTRING_INDEX(exam, "_", 1) as course_code FROM seating WHERE invigilator_id = ?',
      [req.user.userId]
    );

    if (seatingRecords.length === 0) {
      return res.json({ success: true, invigilations: [] });
    }

    // Get unique course codes
    const courseCodes = [...new Set(seatingRecords.map((s) => s.course_code))];

    // Get exam data for these courses
    const placeholders = courseCodes.map(() => "?").join(",");
    const [examData] = await pool.query(
      `SELECT * FROM exams WHERE course_code IN (${placeholders})`,
      courseCodes
    );

    // Combine seating and exam data
    const invigilations = seatingRecords.map((seating) => {
      const seatingDate = seating.exam.split('_')[1];
      const exam = examData.find((e) => {
        const examDate = e.exam_date ? formatDateForMySQL(e.exam_date) : null;
        return e.course_code === seating.course_code && examDate === seatingDate;
      });
      
      return {
        ...seating,
        course_code: exam?.course_code || seating.course_code,
        exam_date: exam?.exam_date ? formatDateForMySQL(exam.exam_date) : seatingDate,
        start_time: exam?.start_time || "10:00",
        end_time: exam?.end_time || "13:00",
        exam_type: exam?.exam_type || 1
      };
    });

    // Parse student lists and get student details
    const invigilationsWithStudents = await Promise.all(
      invigilations.map(async (invigilation) => {
        let studentIds = [];
        try {
          if (Array.isArray(invigilation.student_list)) {
            studentIds = invigilation.student_list;
          } else if (typeof invigilation.student_list === "string") {
            studentIds = JSON.parse(invigilation.student_list);
          } else {
            studentIds = [];
          }
        } catch (error) {
          studentIds = [];
        }

        if (studentIds.length > 0) {
          const placeholders = studentIds.map(() => "?").join(",");
          const [students] = await pool.query(
            `SELECT reg_no, student_name FROM students WHERE reg_no IN (${placeholders})`,
            studentIds
          );

          return {
            ...invigilation,
            student_count: studentIds.length,
            students: students,
          };
        }

        return {
          ...invigilation,
          student_count: 0,
          students: [],
        };
      })
    );

    res.json({
      success: true,
      invigilations: invigilationsWithStudents,
    });
  } catch (error) {
    console.error("Error fetching invigilator invigilations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
