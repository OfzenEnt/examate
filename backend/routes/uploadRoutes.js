import express from 'express';
import multer from 'multer';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express();
const upload = multer({ dest: '../uploads/' });


router.post('/upload-student-data', authenticateToken,  upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const filePath = path.resolve(req.file.path);
    const connection = pool.getConnection();
    
    try{
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        const rows = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            rows.push(row.values.slice(1));
        });

        const dataRows = rows.slice(1);

        (await connection).beginTransaction();

        for (const row of dataRows) {
            query = `INSERT INTO 
            students(reg_no, student_name, semester, student_dept, student_sec, student_programme, student_campus) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
            await pool.execute(query, [
                row[0], 
                row[1], 
                row[2], 
                row[3] || req.user.dept, 
                row[4], 
                row[5] || req.user.programme, 
                row[6] || req.user.campus
            ]);
        }

        (await connection).commit();

        res.json({ message: 'File processed and data inserted successfully!'})
        fs.unlinkSync(filePath);
    }
    catch(err){
        console.error(err);
        (await connection).rollback();
        res.status(500).send("Error processing file.");
    }
    finally {
        connection.release();
        try {
            fs.unlinkSync(filePath);
        } 
        catch (e) {
            console.warn('Failed to delete file:', e);
        }
    }
});

router.post('/upload-courses-data', authenticateToken, upload.single('file'), async(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const filePath = path.resolve(req.file.path);
    const connection = pool.getConnection();
    
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        const rows = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            rows.push(row.values.slice(1));
        });

        const dataRows = rows.slice(1);

        (await connection).beginTransaction();

        for (const row of dataRows) {
            const query = `INSERT INTO 
            courses(course_code, course_name, course_semester, course_dept, course_programme, course_campus) 
            VALUES (?, ?, ?, ?, ?, ?)`;
    
            await pool.execute(query, [row[0], row[1], row[2], row[3] || req.user.dept, row[4] || req.user.programme, row[5]] || req.user.programme);
        }

        (await connection).commit();

        res.json({ message: 'Courses data processed and inserted successfully!' });
    }
    catch(err){
        console.error(err);
        (await connection).rollback();
        res.status(500).send("Error processing courses file.");
    }
    finally {
        (await connection).release();
        try {
            fs.unlinkSync(filePath);
        } 
        catch (e) {
            console.warn('Failed to delete file:', e);
        }
    }
});






export default router;