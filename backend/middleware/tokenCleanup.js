import pool from '../config/database.js';

// Clean up expired refresh tokens and blacklisted tokens
export const cleanupExpiredTokens = async () => {
    try {
        await pool.execute('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
        await pool.execute('DELETE FROM blacklisted_tokens WHERE expires_at < NOW()');
        console.log('Expired tokens cleaned up');
    } catch (error) {
        console.error('Token cleanup error:', error);
    }
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);