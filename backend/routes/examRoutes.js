import express from 'express';
import pool from '../config/database.js';
import {authenticateToken, requireRole} from '../middleware/auth.js';

const router = express.Router();

router.post("/create-exam", authenticateToken, requireRole(1), async (req, res)=>{
    try {
        const {course_code, exam_date, exam_type, exam_slot, start_time, end_time} = req.body;
        const created_by = req.user.name;
        const insertQuery = `INSERT INTO exams 
        (course_code, exam_type, exam_date, exam_slot, start_time, end_time, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
        // const exam_date = formatDateForMySQL(rawExamDate);

        await pool.query(insertQuery, [
            course_code, exam_type, exam_date, exam_slot, start_time, end_time, created_by
        ]);

        res.status(201).json({ message: "Exam created successfully" });
    }
    catch(err){
        console.log("Error creating exam: ", err);
        res.status(500).json({message: "Internal server error"});
    }
});


router.get("/get-exams", authenticateToken, async (req, res) => {
  try {
    const { semester } = req.query;
    let query = `SELECT * FROM exams WHERE 1=1`;
    const params = [];

    if(semester) {
        query += " AND semester = ?";
        params.push(semester);
    }

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      exams: rows
    });

  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.delete("/delete-exam/:id", authenticateToken, requireRole(1), async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM exams WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put("/update-exam/:id", authenticateToken, requireRole(1), async (req, res) => {
    try {
        const { id } = req.params;
        const { course_code, exam_date, exam_type, exam_slot, start_time, end_time } = req.body;
        
        const [result] = await pool.execute(
            `UPDATE exams SET course_code = ?, exam_type = ?, exam_date = ?, exam_slot = ?, start_time = ?, end_time = ? WHERE id = ?`,
            [course_code, exam_type, exam_date, exam_slot, start_time, end_time, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        
        res.json({ message: 'Exam updated successfully' });
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
