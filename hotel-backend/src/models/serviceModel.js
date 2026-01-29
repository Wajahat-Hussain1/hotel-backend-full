const { getPool } = require("../../config/db");

// CREATE
async function createService({ service_name, price, description }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO service (service_name, price, description)
     VALUES (?, ?, ?)`,
    [service_name, price, description]
  );
  return result.insertId;
}

// GET ALL
async function getAll() {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM service ORDER BY service_id DESC`);
  return rows;
}

// GET BY ID
async function getById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM service WHERE service_id = ?`, [id]);
  return rows[0];
}

// UPDATE
async function updateService(id, data) {
  const pool = getPool();

  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE service SET ${fields.join(", ")} WHERE service_id = ?`,
    values
  );

  return result.affectedRows;
}

// DELETE
async function deleteService(id) {
  const pool = getPool();
  const [result] = await pool.query(`DELETE FROM service WHERE service_id = ?`, [id]);
  return result.affectedRows;
}



module.exports = {
  createService,
  getAll,
  getById,
  updateService,
  deleteService
};
