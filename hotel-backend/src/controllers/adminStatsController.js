// src/controllers/adminStatsController.js
const { getPool } = require("../../config/db");
const { success, error } = require("../utils/responseHelper");

async function getDashboardStats(req, res) {
  try {
    const pool = getPool();

    // Total bookings
    const [[{ total_bookings }]] = await pool.query(`
      SELECT COUNT(*) AS total_bookings FROM booking
    `);

    // Total customers
    const [[{ total_customers }]] = await pool.query(`
      SELECT COUNT(*) AS total_customers FROM customer
    `);

    // Total staff
    const [[{ total_staff }]] = await pool.query(`
      SELECT COUNT(*) AS total_staff FROM staff
    `);

    // Revenue (sum of paid bookings)
    const [[{ revenue }]] = await pool.query(`
      SELECT IFNULL(SUM(total_price),0) AS revenue FROM booking WHERE booking_status = 'paid'
    `);

    // Available rooms (total rooms - occupied rooms)
    const [[{ total_rooms }]] = await pool.query(`SELECT COUNT(*) AS total_rooms FROM room`);
    const [[{ occupied_rooms }]] = await pool.query(`
      SELECT COUNT(*) AS occupied_rooms
      FROM booking b
      WHERE b.booking_status = 'paid' AND CURDATE() BETWEEN DATE(b.check_in) AND DATE_SUB(DATE(b.check_out), INTERVAL 1 DAY)
    `);

    const available_rooms = Math.max(0, (total_rooms || 0) - (occupied_rooms || 0));

    return success(res, {
      total_bookings: total_bookings || 0,
      total_customers: total_customers || 0,
      total_staff: total_staff || 0,
      revenue: revenue || 0,
      total_rooms: total_rooms || 0,
      occupied_rooms: occupied_rooms || 0,
      available_rooms,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return error(res, "Failed to fetch dashboard stats");
  }
}

async function getRecentBookings(req, res) {
  try {
    const pool = getPool();
    // recent 6 bookings with basic join info
    const [rows] = await pool.query(`
      SELECT 
        b.booking_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.booking_status,
        b.created_at,
        r.room_number,
        rt.type_name,
        c.first_name,
        c.last_name
      FROM booking b
      LEFT JOIN room r ON b.room_id = r.room_id
      LEFT JOIN room_type rt ON r.type_id = rt.type_id
      LEFT JOIN customer c ON b.customer_id = c.customer_id
      ORDER BY b.booking_id DESC
      LIMIT 6
    `);

    return success(res, rows);
  } catch (err) {
    console.error("getRecentBookings error:", err);
    return error(res, "Failed to fetch recent bookings");
  }
}

module.exports = { getDashboardStats, getRecentBookings };
