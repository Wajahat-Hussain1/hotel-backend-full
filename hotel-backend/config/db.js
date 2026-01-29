const mysql = require('mysql2/promise');
let pool;

function initDB() {
  if (pool) return pool;
  
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000, // TiDB uses port 4000
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'hotel_booking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // REQUIRED for TiDB Cloud connection security
    ssl: {
      rejectUnauthorized: true
    }
  });

  console.log('Connected to TiDB Cloud MySQL pool');
  return pool;
}

function getPool() {
  if (!pool) throw new Error('DB not initialized. Call initDB() first.');
  return pool;
}

module.exports = { initDB, getPool };