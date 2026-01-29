const { getPool } = require('../../config/db');

async function getAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM room_type ORDER BY type_id');
  return rows;
}

async function createType({ type_name, base_price, capacity }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO room_type (type_name, base_price, capacity)
     VALUES (?, ?, ?)`,
    [type_name, base_price, capacity]
  );
  return result.insertId;
}

module.exports = { getAll, createType };
