const { getPool } = require("../../config/db");

// CREATE FEEDBACK
async function createFeedback({ booking_id, rating, comments }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO feedback (booking_id, rating, comments)
     VALUES (?, ?, ?)`,
    [booking_id, rating, comments]
  );
  return result.insertId;
}

// GET ALL FEEDBACK
async function getAll() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT f.*, b.customer_id, b.room_id
    FROM feedback f
    JOIN booking b ON f.booking_id = b.booking_id
    ORDER BY f.feedback_id DESC
  `);
  return rows;
}

// GET SINGLE FEEDBACK
async function getById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT f.*, b.customer_id 
     FROM feedback f
     JOIN booking b ON f.booking_id = b.booking_id
     WHERE feedback_id = ?`,
    [id]
  );
  return rows[0];
}

// UPDATE FEEDBACK
async function updateFeedback(id, data) {
  const pool = getPool();
  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [res] = await pool.query(
    `UPDATE feedback SET ${fields.join(", ")} WHERE feedback_id = ?`,
    values
  );

  return res.affectedRows;
}

// DELETE FEEDBACK
async function deleteFeedback(id) {
  const pool = getPool();
  const [res] = await pool.query(
    `DELETE FROM feedback WHERE feedback_id = ?`,
    [id]
  );
  return res.affectedRows;
}

module.exports = {
  createFeedback,
  getAll,
  getById,
  updateFeedback,
  deleteFeedback
};
