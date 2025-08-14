import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router()

router.post("/create-room", async(req, res)=>{
    const { room_id, room_type, block_alias, room_status, n_rows, n_columns } = req.body;

    if (!room_id || !room_type || !block_alias) {
        return res.status(400).json({ error: 'Missing required fields: room_id, room_type, block_alias' })
    }

    try {
        await pool.execute(
            `INSERT INTO rooms (room_id, room_type, block_alias, room_status, n_rows, n_columns)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [room_id, room_type, block_alias, room_status || 0, n_rows || 6, n_columns || 9]
        );
        return res.status(201).json({ message: 'Room Created Successfully', room_id})
    }
    catch(error){
        console.error('Error creating room: ', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

router.get("/get-rooms", async(req, res) =>{
    try{
        let query = 'SELECT * FROM rooms WHERE 1=1';
        const params = [];
        
        // Optional filter: block_alias
        if (req.query.block_alias) {
            query += ' AND block_alias = ?';
            params.push(req.query.block_alias);
        }
        
        // Optional filter: room_type
        if (req.query.room_type) {
            query += ' AND room_type = ?';
            params.push(req.query.room_type);
        }

        if (req.query.room_id) {
            query += ' AND room_id = ?';
            params.push(req.query.room_id);
        }
        
        const [rows] = await pool.query(query, params);
        res.json({ success: true, rooms: rows });
    }
    catch(error){
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ error: 'Internal server error'});
    }
});


router.put("/update-room/:room_id", async(req, res) => {
    const { room_id } = req.params;
    const { room_type, block_alias, room_status, n_rows, n_columns } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE rooms SET room_type = ?, block_alias = ?, room_status = ?, n_rows = ?, n_columns = ? WHERE room_id = ?',
            [room_type, block_alias, room_status, n_rows, n_columns, room_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        
        res.json({ message: 'Room updated successfully', room_id });
    } catch(error) {
        console.error('Error updating room:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/delete-room/:room_id", async(req, res) => {
    const { room_id } = req.params;

    try {
        const [result] = await pool.execute(
            'DELETE FROM rooms WHERE room_id = ?',
            [room_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        
        res.json({ message: 'Room deleted successfully', room_id });
    } catch(error) {
        console.error('Error deleting room:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/rooms/my', authenticateToken, async (req, res) => {
  try {
    const { campus } = req.user; 
    const sql = `
      SELECT r.room_id, r.room_type, r.block_alias, r.room_status,
             r.n_rows, r.n_columns, r.room_capacity,
             b.campus_alias
      FROM rooms r
      JOIN blocks b ON r.block_alias = b.block_alias
      JOIN campus c ON b.campus_alias = c.campus_alias
      WHERE c.campus_name = ? OR c.campus_alias = ?;
    `;
    const [rows] = await pool.query(sql, [campus, campus]);
    res.json({ success: true, rooms: rows });
  } catch (err) {
    console.error('GET /rooms/my error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


export default router;