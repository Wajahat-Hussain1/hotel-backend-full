const { getPool } = require("../../config/db");

// CREATE
async function createRoom({ room_number, type_id, status }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO room (room_number, type_id, status)
     VALUES (?, ?, ?)`,
    [room_number, type_id, status]
  );
  return result.insertId;
}

// GET ALL ROOMS
async function getAll() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT r.*, rt.type_name, rt.capacity, rt.base_price
    FROM room r
    LEFT JOIN room_type rt ON r.type_id = rt.type_id
    ORDER BY room_id DESC
  `);
  return rows;
}

// GET BY ID
async function getById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT r.*, rt.type_name, rt.capacity, rt.base_price
     FROM room r
     LEFT JOIN room_type rt ON r.type_id = rt.type_id
     WHERE room_id = ?`,
    [id]
  );
  return rows[0];
}

// UPDATE
async function updateRoom(id, data) {
  const pool = getPool();

  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
  values.push(id);

  const [result] = await pool.query(
    `UPDATE room SET ${fields.join(", ")} WHERE room_id = ?`,
    values
  );

  return result.affectedRows;
}

// DELETE
async function deleteRoom(id) {
  const pool = getPool();
  const [result] = await pool.query(
    `DELETE FROM room WHERE room_id = ?`,
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  createRoom,
  getAll,
  getById,
  updateRoom,
  deleteRoom
};
