const {
  createBooking,
  getAll,
  getById,
  updateBooking,
  deleteBooking,
  
} = require("../models/bookingModel");

const { success, error } = require("../utils/responseHelper");
const { getPool } = require("../../config/db");

// ---------------------------------------------------------
// GET ALL BOOKINGS
// ---------------------------------------------------------
// async function listBookings(req, res) {
//   try {
//     const bookings = await getAll();
//     return success(res, bookings);
//   } catch (err) {
//     return error(res, "Failed to fetch bookings");
//   }
// }
async function listBookings(req, res) {
  try {
    const pool = getPool();

    const status = req.query.status || null;
    const search = req.query.search || null;

    let query = `
      SELECT 
        b.*, 
        c.first_name, c.last_name,
        r.room_number,
        rt.type_name
      FROM booking b
      LEFT JOIN customer c ON b.customer_id = c.customer_id
      LEFT JOIN room r ON b.room_id = r.room_id
      LEFT JOIN room_type rt ON r.type_id = rt.type_id
      WHERE 1
    `;

    const params = [];

    if (status) {
      query += ` AND b.booking_status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (c.first_name LIKE ? OR c.last_name LIKE ? OR r.room_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY b.booking_id DESC`;

    const [rows] = await pool.query(query, params);

    return success(res, rows);
  } catch (err) {
    console.error(err);
    return error(res, "Failed to fetch bookings");
  }
}


// ---------------------------------------------------------
// GET SINGLE BOOKING
// ---------------------------------------------------------
async function getBooking(req, res) {
  try {
    const booking = await getById(req.params.id);
    if (!booking) return error(res, "Booking not found", 404);

    return success(res, booking);
  } catch (err) {
    return error(res, "Failed to fetch booking");
  }
}

// // ---------------------------------------------------------
// // CREATE BOOKING
// // ---------------------------------------------------------
// async function createBookingController(req, res) {
//   try {
//     const { room_id, check_in, check_out } = req.body;

//     const customer_id = req.user.id; // Logged in user

//     if (!customer_id || !room_id || !check_in || !check_out)
//       return error(res, "Required fields missing", 400);

//     const id = await createBooking({
//       customer_id,
//       room_id,
//       check_in,
//       check_out,
//       total_price: 0,
//       booking_status: "pending"
//     });

//     return success(res, { id }, "Booking created", 201);
//   } catch (err) {
//     console.log(err);
//     return error(res, "Failed to create booking");
//   }
// }
async function createBookingController(req, res) {
  try {
    const { room_id, check_in, check_out } = req.body;
    const customer_id = req.user.id;

    if (!customer_id || !room_id || !check_in || !check_out) {
      return error(res, "Required fields missing", 400);
    }

    const pool = getPool();

    // 🔴 AVAILABILITY CHECK (CRITICAL FIX)
    const [conflict] = await pool.query(
      `
      SELECT booking_id
      FROM booking
      WHERE room_id = ?
        AND booking_status != 'cancelled'
        AND check_in < ?
        AND check_out > ?
      `,
      [room_id, check_out, check_in]
    );

    if (conflict.length > 0) {
      return error(
        res,
        "Room is already booked for selected dates",
        400
      );
    }

    // ✅ SAFE TO CREATE BOOKING
    const id = await createBooking({
      customer_id,
      room_id,
      check_in,
      check_out,
    });

    return success(res, { id }, "Booking created", 201);

  } catch (err) {
    console.error(err);
    return error(res, "Failed to create booking");
  }
}


// ---------------------------------------------------------
// UPDATE BOOKING
// ---------------------------------------------------------
async function updateBookingController(req, res) {
  try {
    const id = req.params.id;

    const booking = await getById(id);
    if (!booking) return error(res, "Booking not found", 404);

    await updateBooking(id, req.body);

    return success(res, {}, "Booking updated");
  } catch (err) {
    return error(res, "Failed to update booking");
  }
}

// ---------------------------------------------------------
// DELETE BOOKING
// ---------------------------------------------------------
async function deleteBookingController(req, res) {
  try {
    const id = req.params.id;

    const booking = await getById(id);
    if (!booking) return error(res, "Booking not found", 404);

    await deleteBooking(id);

    return success(res, {}, "Booking deleted");
  } catch (err) {
    return error(res, "Failed to delete booking");
  }
}


// // ===============================
// GET BOOKING INVOICE DATA (ADMIN + CUSTOMER)
// ===============================
async function getBookingInvoice(req, res) {
  try {
    const bookingId = req.params.id;
    const pool = getPool();

    // -------- MAIN BOOKING + PAYMENT --------
    const [[invoice]] = await pool.query(`
      SELECT
        b.booking_id,
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
        c.email,
        r.room_number,
        rt.type_name,
        b.check_in,
        b.check_out,
        b.total_price AS room_total,
        b.booking_status,
        IFNULL(SUM(p.amount), 0) AS paid_amount
      FROM booking b
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN room r ON b.room_id = r.room_id
      JOIN room_type rt ON r.type_id = rt.type_id
      LEFT JOIN payment p ON b.booking_id = p.booking_id
      WHERE b.booking_id = ?
      GROUP BY b.booking_id
    `, [bookingId]);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    // -------- SERVICES (🔥 FIXED QUERY) --------
    const [services] = await pool.query(`
      SELECT
        so.order_id,
        s.service_name,
        so.quantity,
        s.price,
        (so.quantity * s.price) AS total
      FROM service_order so
      JOIN service s ON so.service_id = s.service_id
      WHERE so.booking_id = ?
    `, [bookingId]);

    const servicesTotal = services.reduce(
      (sum, s) => sum + Number(s.total),
      0
    );

    const grandTotal =
      Number(invoice.room_total) + Number(servicesTotal);

    res.json({
      success: true,
      data: {
        ...invoice,
        services,
        services_total: servicesTotal,
        grand_total: grandTotal,
      },
    });

  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load invoice",
    });
  }
}

// ---------------------------------------------------------
// CHECK ROOM AVAILABILITY (PUBLIC)
// ---------------------------------------------------------
async function checkRoomAvailability(req, res) {
  try {
    const { room_id, check_in, check_out } = req.body;

    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({
        available: false,
        message: "Missing data",
      });
    }

    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT booking_id
      FROM booking
      WHERE room_id = ?
        AND booking_status != 'cancelled'
        AND check_in < ?
        AND check_out > ?
      `,
      [room_id, check_out, check_in]
    );

    if (rows.length > 0) {
      return res.json({ available: false });
    }

    return res.json({ available: true });

  } catch (err) {
    console.error("Availability error:", err);
    return res.status(500).json({ available: false });
  }
}

module.exports = {
  listBookings,
  getBooking,
  createBooking: createBookingController,
  updateBooking: updateBookingController,
  deleteBooking: deleteBookingController,
  getBookingInvoice,
  checkRoomAvailability, // 👈 ADD THIS
};

// module.exports = {
//   listBookings,
//   getBooking,
//   createBooking: createBookingController,
//   updateBooking: updateBookingController,
//   deleteBooking: deleteBookingController,
//   getBookingInvoice,
// };
