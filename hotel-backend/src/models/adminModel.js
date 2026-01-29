const { getPool } = require('../../config/db');

async function findByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
  return rows[0];
}

module.exports = { findByUsername };
