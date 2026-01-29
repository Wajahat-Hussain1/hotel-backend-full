


const { getPool } = require("../../config/db");

// CREATE PAYMENT WITH CANCEL WINDOW
async function createPayment({ booking_id, amount, payment_method }) {
  const pool = getPool();

  const [result] = await pool.query(
    `
    INSERT INTO payment 
    (booking_id, amount, payment_method, payment_status, cancel_until)
    VALUES (?, ?, ?, 'paid', DATE_ADD(NOW(), INTERVAL 2 HOUR))
    `,
    [booking_id, amount, payment_method]
  );

  return result.insertId;
}

// GET PAYMENT BY ID
async function getById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM payment WHERE payment_id = ?`,
    [id]
  );
  return rows[0];
}

// GET PAYMENTS FOR A BOOKING
async function getByBooking(booking_id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM payment WHERE booking_id = ?`,
    [booking_id]
  );
  return rows;
}

module.exports = {
  createPayment,
  getById,
  getByBooking
};
