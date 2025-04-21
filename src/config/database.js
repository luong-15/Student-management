const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

let pool = null; // Add this line to cache the pool

// Create connection pool with retries
const createPool = async (retries = 5) => {
    if (pool) return pool; // Return existing pool if available

    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '12345',
        database: process.env.DB_NAME || 'qlsv',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };

    try {
        pool = mysql.createPool(config);
        await testConnection(pool);
        return pool;
    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return createPool(retries - 1);
        }
        throw err;
    }
};

// Test connection function
const testConnection = async (pool) => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection info:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            status: 'Connected successfully'
        });
        connection.release();
        return true;
    } catch (err) {
        console.error('Database connection error:', {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState
        });
        throw err;
    }
    
};

// Helper function for executing queries
const query = async (sql, params = []) => {
    const pool = await createPool();
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (err) {
        console.error('Query error:', {
            sql,
            params,
            error: err.message
        });
        throw err;
    }
};

module.exports = {
    createPool,
    query,
    testConnection
};