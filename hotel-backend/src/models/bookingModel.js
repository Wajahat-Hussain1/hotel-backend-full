const { getPool } = require("../../config/db");


// ---------------------------------------------------------
// CREATE BOOKING (Auto-price calculation)
// ---------------------------------------------------------
async function createBooking({ customer_id, room_id, check_in, check_out }) {
  const pool = getPool();

  // Get room price
  const [[room]] = await pool.query(
    `SELECT rt.base_price 
     FROM room r 
     JOIN room_type rt ON r.type_id = rt.type_id 
     WHERE r.room_id = ?`,
    [room_id]
  );

  const days =
    (new Date(check_out) - new Date(check_in)) /
    (1000 * 60 * 60 * 24);

  const total_price = room.base_price * days;

  const [result] = await pool.query(
    `INSERT INTO booking (customer_id, room_id, check_in, check_out, total_price, booking_status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [customer_id, room_id, check_in, check_out, total_price]
  );

  return result.insertId;
}


// ---------------------------------------------------------
// GET ALL BOOKINGS (Admin)
// ---------------------------------------------------------
async function getAll() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT b.*, 
      c.first_name, c.last_name, 
      r.room_number 
    FROM booking b
    LEFT JOIN customer c ON b.customer_id = c.customer_id
    LEFT JOIN room r ON b.room_id = r.room_id
    ORDER BY b.booking_id DESC
  `);
  return rows;
}


// ---------------------------------------------------------
// GET ONE BOOKING
// ---------------------------------------------------------
async function getById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
    SELECT b.*, 
      c.first_name, c.last_name, 
      r.room_number 
    FROM booking b
    LEFT JOIN customer c ON b.customer_id = c.customer_id
    LEFT JOIN room r ON b.room_id = r.room_id
    WHERE b.booking_id = ?
    `,
    [id]
  );
  return rows[0];
}


// ---------------------------------------------------------
// GET BOOKINGS OF ONE CUSTOMER
// Used in: MyBookings page
// ---------------------------------------------------------
// async function getByCustomer(customer_id) {
//   const pool = getPool();
//   const [rows] = await pool.query(
//     `
//     SELECT 
//       b.*,
//       r.room_number,
//       rt.type_name,
//       rt.base_price
//     FROM booking b
//     LEFT JOIN room r ON b.room_id = r.room_id
//     LEFT JOIN room_type rt ON r.type_id = rt.type_id
//     WHERE b.customer_id = ?
//     ORDER BY b.booking_id DESC
//     `,
//     [customer_id]
//   );
//   return rows;
// }


async function getByCustomer(customer_id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.room_id,
      b.customer_id,
      b.check_in,
      b.check_out,
      b.total_price,
      b.booking_status,
      b.created_at,
      r.room_number,
      rt.type_name,
      rt.base_price
    FROM booking b
    LEFT JOIN room r ON b.room_id = r.room_id
    LEFT JOIN room_type rt ON r.type_id = rt.type_id
    WHERE b.customer_id = ?
    ORDER BY b.booking_id DESC
    `,
    [customer_id]
  );
  return rows;
}


// ---------------------------------------------------------
// UPDATE BOOKING
// ---------------------------------------------------------
async function updateBooking(id, data) {
  const pool = getPool();
  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE booking SET ${fields.join(", ")} WHERE booking_id = ?`,
    values
  );

  return result.affectedRows;
}


// ---------------------------------------------------------
// DELETE BOOKING
// ---------------------------------------------------------
async function deleteBooking(id) {
  const pool = getPool();
  const [result] = await pool.query(
    `DELETE FROM booking WHERE booking_id = ?`,
    [id]
  );
  return result.affectedRows;
}


// ---------------------------------------------------------
module.exports = {
  createBooking,
  getAll,
  getById,
  getByCustomer,
  updateBooking,
  deleteBooking
};






