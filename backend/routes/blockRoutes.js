import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/blocks', async (req, res) => {
    const { campus } = req.user.campus;
    query =  `SELECT * FROM blocks WHERE campus_alias = ?`;
    try{
        await pool.query(query, [campus], (err, results) => {
            if (err) {
                console.error('Error fetching blocks:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(results);
        });
    }

    catch(err){
        console.error('Error fetching blocks:', err);
        return res.status(500).json({ error: 'Internal server error'});
    }
});