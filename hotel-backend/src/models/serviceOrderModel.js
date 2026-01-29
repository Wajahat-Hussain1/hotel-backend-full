const { getPool } = require("../../config/db");

// ─────────────────────────────────────────────
// CREATE SERVICE ORDER
// ─────────────────────────────────────────────
async function createOrder({ booking_id, service_id, quantity }) {
  const pool = getPool();

  const [result] = await pool.query(
    `
    INSERT INTO service_order (booking_id, service_id, quantity)
    VALUES (?, ?, ?)
    `,
    [booking_id, service_id, quantity]
  );

  return result.insertId;
}

// ─────────────────────────────────────────────
// GET ALL SERVICE ORDERS (ADMIN OVERVIEW)
// ─────────────────────────────────────────────
async function getAll() {
  const pool = getPool();

  const [rows] = await pool.query(`
    SELECT 
      so.order_id,
      so.booking_id,
      s.service_name,
      s.price,
      so.quantity,
      (so.quantity * s.price) AS total_amount,
      b.check_in,
      b.check_out
    FROM service_order so
    JOIN service s ON so.service_id = s.service_id
    JOIN booking b ON so.booking_id = b.booking_id
    ORDER BY so.order_id DESC
  `);

  return rows;
}

// ─────────────────────────────────────────────
// GET SINGLE SERVICE ORDER
// ─────────────────────────────────────────────
async function getById(id) {
  const pool = getPool();

  const [rows] = await pool.query(
    `
    SELECT 
      so.order_id,
      so.booking_id,
      s.service_name,
      s.price,
      so.quantity,
      (so.quantity * s.price) AS total_amount
    FROM service_order so
    JOIN service s ON so.service_id = s.service_id
    WHERE so.order_id = ?
    `,
    [id]
  );

  return rows[0];
}

// ─────────────────────────────────────────────
// GET SERVICE ORDERS BY BOOKING (🔥 MAIN ADMIN USE)
// ─────────────────────────────────────────────
// GET BY BOOKING (FIXED)
async function getByBooking(bookingId) {
  const pool = getPool();

  const [rows] = await pool.query(`
    SELECT 
      so.order_id,
      so.booking_id,
      so.quantity,
      s.service_name,
      s.price,
      (so.quantity * s.price) AS total_price
    FROM service_order so
    JOIN service s ON so.service_id = s.service_id
    WHERE so.booking_id = ?
  `, [bookingId]);

  return rows;
}


// ─────────────────────────────────────────────
// UPDATE SERVICE ORDER
// ─────────────────────────────────────────────
async function updateOrder(id, data) {
  const pool = getPool();

  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [result] = await pool.query(
    `
    UPDATE service_order
    SET ${fields.join(", ")}
    WHERE order_id = ?
    `,
    values
  );

  return result.affectedRows;
}

// ─────────────────────────────────────────────
// DELETE SERVICE ORDER
// ─────────────────────────────────────────────
async function deleteOrder(id) {
  const pool = getPool();

  const [result] = await pool.query(
    `DELETE FROM service_order WHERE order_id = ?`,
    [id]
  );

  return result.affectedRows;
}



module.exports = {
  createOrder,
  getAll,
  getById,
  getByBooking,
  updateOrder,
  deleteOrder
};
