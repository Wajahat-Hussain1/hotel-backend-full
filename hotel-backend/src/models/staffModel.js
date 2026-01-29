const { getPool } = require("../../config/db");

// CREATE STAFF
async function createStaff({ name, email, password, role, phone, salary, hired_date }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO staff (name, email, password, role, phone, salary, hired_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, role, phone, salary, hired_date]
  );
  return result.insertId;
}

// GET ALL STAFF
async function getAll() {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM staff ORDER BY staff_id DESC");
  return rows;
}

// GET SINGLE STAFF
async function getById(id) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM staff WHERE staff_id = ?", [id]);
  return rows[0];
}

// UPDATE STAFF
async function updateStaff(id, data) {
  const pool = getPool();
  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE staff SET ${fields.join(", ")} WHERE staff_id = ?`,
    values
  );
  return result.affectedRows;
}


// DELETE STAFF
async function deleteStaff(id) {
  const pool = getPool();
  const [result] = await pool.query("DELETE FROM staff WHERE staff_id = ?", [id]);
  return result.affectedRows;
}

// CHECK BY EMAIL
async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM staff WHERE email = ?", [email]);
  return rows[0];
}

module.exports = {
  createStaff,
  getAll,
  getById,
  updateStaff,
  deleteStaff,
  findByEmail
};
