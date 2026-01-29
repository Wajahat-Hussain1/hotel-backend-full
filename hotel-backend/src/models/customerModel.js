
const { getPool } = require("../../config/db");

// GET ALL CUSTOMERS
async function getAllCustomers() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT customer_id, first_name, last_name, email ,created_at
    FROM customer 
    ORDER BY customer_id 
  `);
  return rows;
}

// GET CUSTOMER BY ID
async function getCustomerById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT customer_id, first_name, last_name, email FROM customer WHERE customer_id = ?`,
    [id]
  );
  return rows[0];
}

// CREATE CUSTOMER
async function createNewCustomer(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO customer (first_name, last_name, email, password)
     VALUES (?, ?, ?, ?)`,
    [data.first_name, data.last_name, data.email, data.password]
  );
  return result;
}

// UPDATE CUSTOMER
async function updateCustomerById(id, data) {
  const pool = getPool();

  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE customer SET ${fields.join(", ")} WHERE customer_id = ?`,
    values
  );

  return result.affectedRows;
}

// DELETE CUSTOMER
async function deleteCustomerById(id) {
  const pool = getPool();
  const [result] = await pool.query(
    `DELETE FROM customer WHERE customer_id = ?`,
    [id]
  );

  return result.affectedRows;
}
// GET CUSTOMER BY EMAIL
async function findCustomerByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM customer WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
}


module.exports = {
  getAllCustomers,
  getCustomerById,
  createNewCustomer,
  updateCustomerById,
  deleteCustomerById,
  findCustomerByEmail,
};

