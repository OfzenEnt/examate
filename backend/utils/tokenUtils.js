import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config({"override": true})

const hashRefreshToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateTokens = (user) => {
    const jti = crypto.randomUUID();
    const accessToken = jwt.sign(
        {
            userId: user.user_id,
            role: user.role,
            name: user.faculty_name || user.name,
            dept: user.faculty_dept,
            programme: user.faculty_programme,
            campus: user.faculty_campus || user.campus,
            jti
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    
    return { accessToken, refreshToken, jti };
};

export const saveRefreshToken = async (userId, refreshToken) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const hashedToken = hashRefreshToken(refreshToken);
    
    await pool.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, hashedToken, expiresAt]
    );
};

export const validateRefreshToken = async (token) => {
    const hashedToken = hashRefreshToken(token);
    const [rows] = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
        [hashedToken]
    );
    
    return rows.length > 0 ? rows[0] : null;
};

export const deleteRefreshToken = async (token) => {
    const hashedToken = hashRefreshToken(token);
    await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [hashedToken]);
};

export const deleteUserRefreshTokens = async (userId) => {
    const [result] = await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
    return result.affectedRows;
};

export const blacklistToken = async (jti, expiresAt) => {
    await pool.execute(
        'INSERT INTO blacklisted_tokens (token_jti, expires_at) VALUES (?, ?)',
        [jti, expiresAt]
    );
};

export const isTokenBlacklisted = async (jti) => {
    const [rows] = await pool.query(
        'SELECT 1 FROM blacklisted_tokens WHERE token_jti = ?',
        [jti]
    );
    return rows.length > 0;
};

export const blacklistUserTokens = async (userId) => {
    // Get all refresh tokens for user to find associated access tokens
    const [refreshTokens] = await pool.query(
        'SELECT * FROM refresh_tokens WHERE user_id = ?',
        [userId]
    );
    
    // Note: We can't blacklist existing access tokens without storing JTIs
    // This is a limitation of JWT - existing tokens remain valid until expiry
    // Best practice: Keep access token TTL short (15m)
    
    return refreshTokens.length;
};