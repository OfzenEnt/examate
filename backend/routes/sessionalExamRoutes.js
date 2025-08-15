import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get("/exam-rooms-info", authenticateToken, requireRole(1), async (req, res) => {
    try {
        const { course_code } = req.query; // optional param

        // Step 1: Fetch seating + room_status
        let query = `
            SELECT seating.*, rooms.room_status
            FROM seating
            INNER JOIN rooms ON seating.room_id = rooms.room_id
        `;

        let params = [];

        // Step 2: Add filtering if course_code provided
        if (course_code) {
            query += ` WHERE FIND_IN_SET(?, seating.exams_list)`;
            params.push(course_code);
        }

        const [rows] = await pool.query(query, params);

        // Step 3: Convert exams_list to array
        const seatingData = rows.map(row => ({
            ...row,
            exams_list: row.exams_list
                ? row.exams_list.split(",").map(item => item.trim())
                : []
        }));

        // Step 4: Collect all unique course codes from filtered data
        const allCourseCodes = [
            ...new Set(seatingData.flatMap(row => row.exams_list))
        ];

        if (allCourseCodes.length === 0) {
            return res.json({ success: true, data: seatingData });
        }

        // Step 5: Get course_name for those codes
        const [courses] = await pool.query(
            `SELECT course_code, course_name FROM courses WHERE course_code IN (?)`,
            [allCourseCodes]
        );

        const courseMap = Object.fromEntries(
            courses.map(c => [c.course_code, c.course_name])
        );

        // Step 6: Attach course_names to each row
        const finalData = seatingData.map(row => ({
            ...row,
            course_names: row.exams_list.map(code => courseMap[code] || null)
        }));

        res.json({
            success: true,
            data: finalData
        });

    } catch (error) {
        console.error("Error fetching exam rooms:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching exam rooms."
        });
    }
});


router.post("/get-available-rooms", authenticateToken, requireRole(1), async(req, res)=>{
    const { course_code } = req.body;
    
    if (!course_code) {
        return res.status(400).json({ error: 'course_code is required' });
    }
    
    try {
        // Get course details to find campus
        const [courseRows] = await pool.query(
            'SELECT course_campus FROM courses WHERE course_code = ?',
            [course_code]
        );
        
        if (courseRows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        const { course_campus } = courseRows[0];
        
        // Get available rooms for the given exam
        // 0 - completely free, 2 - partially filled
        const [rooms] = await pool.query(
            `SELECT r.*, b.campus_alias 
             FROM rooms r 
             JOIN blocks b ON r.block_alias = b.block_alias 
             WHERE b.campus_alias = ? AND (r.room_status = 0 OR r.room_status = 2)`,
            [course_campus]
        );
        
        res.json({
            success: true,
            course_code,
            campus: course_campus,
            available_rooms: rooms
        });
        
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post("/get-eligible-students", authenticateToken, requireRole(1), async(req, res)=>{
    const { course_code } = req.body;
    
    if (!course_code) {
        return res.status(400).json({ error: 'course_code is required' });
    }
    
    try {
        // Get course details to find semester and campus
        const [courseRows] = await pool.query(
            'SELECT course_semester, course_campus FROM courses WHERE course_code = ?',
            [course_code]
        );
        
        if (courseRows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        const { course_semester, course_campus } = courseRows[0];
        
        // Get students eligible for the given exam and whose seat is not assigned yet
        const [students] = await pool.query(
            'SELECT * FROM students WHERE semester = ? AND student_campus = ? AND seat_assigned IS NULL',
            [course_semester, course_campus]
        );
        
        res.json({
            success: true,
            course_code,
            semester: course_semester,
            campus: course_campus,
            students
        });
        
    } catch (error) {
        console.error('Error fetching eligible students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post("/allocate", authenticateToken, requireRole(1), async (req, res) => {
    const { course_code, room_id, students, block } = req.body;
    const { invigilator_id } = req.query

    if (!course_code || !room_id || !Array.isArray(students)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    if (students.length === 0) {
        await pool.query('UPDATE rooms SET room_status = 0 WHERE room_id = ?', [room_id]);
        return res.json({ success: false, message: 'Room not allocated' });
    }

    try {
        // Get room capacity
        const [roomRows] = await pool.query('SELECT room_capacity FROM rooms WHERE room_id = ?', [room_id]);
        
        if (roomRows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        
        const { room_capacity } = roomRows[0];
        
        for (const student of students) {
            await pool.query('UPDATE students SET student_seat = ? WHERE reg_no = ?', [student.student_seat, student.reg_no]);
        }

        await pool.query(`INSERT INTO seating(room_id, exam_list, student_list, invigilator_id, block) VALUES(?, ?, ?, ?, ?)
            `,[room_id, course_code, students, invigilator_id || null, block]);

        
        const currentCount = students.length();
        const totalStudents = currentCount + students.length;
        const remainingCapacity = room_capacity - totalStudents;
        
        // Set room status based on remaining capacity
        let room_status;
        if (remainingCapacity > 10) {
            room_status = 2; // partially filled
        } else if (remainingCapacity <= 10) {
            room_status = 1; // completely filled
        }
        
        await pool.query('UPDATE rooms SET room_status = ? WHERE room_id = ?', [room_status, room_id]);

        res.json({ success: true, message: 'Room allocated successfully' });
    } catch (error) {
        console.error('Error allocating room for exam:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



export default router;