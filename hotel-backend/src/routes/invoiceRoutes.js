// const express = require("express");
// const router = express.Router();
// const auth = require("../middlewares/authMiddleware");
// const role = require("../middlewares/roleMiddleware");
// const { getPool } = require("../../config/db");

// // GET Invoice Data
// router.get("/:id", auth, role(["customer", "admin", "manager"]), async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const bookingId = req.params.id;

//     const pool = getPool();

//     const [rows] = await pool.query(`
//       SELECT 
//         b.*, 
//         c.first_name, c.last_name, c.email,
//         r.room_number,
//         rt.type_name, rt.base_price
//       FROM booking b
//       JOIN customer c ON b.customer_id = c.customer_id
//       JOIN room r ON b.room_id = r.room_id
//       JOIN room_type rt ON r.type_id = rt.type_id
//       WHERE b.booking_id = ? AND b.customer_id = ?
//     `, [bookingId, userId]);

//     if (rows.length === 0)
//       return res.status(404).json({ message: "Invoice not found" });

//     res.json({ data: rows[0] });

//   } catch (err) {
//     console.error("Invoice error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const { getPool } = require("../../config/db");

// GET Invoice Data (ROOM + SERVICES)
router.get("/:id", auth, role(["customer", "admin", "manager"]), async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const pool = getPool();

    // 1️⃣ Booking + Room
    const [bookingRows] = await pool.query(`
      SELECT 
        b.booking_id,
        b.check_in,
        b.check_out,
        b.total_price AS room_total,
        b.booking_status,
        b.created_at,
        c.first_name, c.last_name, c.email,
        r.room_number,
        rt.type_name,
        rt.base_price
      FROM booking b
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN room r ON b.room_id = r.room_id
      JOIN room_type rt ON r.type_id = rt.type_id
      WHERE b.booking_id = ? AND b.customer_id = ?
    `, [bookingId, userId]);

    if (bookingRows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const booking = bookingRows[0];

    // 2️⃣ Services for this booking
    const [serviceRows] = await pool.query(`
      SELECT 
        so.order_id,
        s.service_name,
        s.price,
        so.quantity,
        (s.price * so.quantity) AS total
      FROM service_order so
      JOIN service s ON so.service_id = s.service_id
      WHERE so.booking_id = ?
    `, [bookingId]);

    // 3️⃣ Calculate totals
    const services_total = serviceRows.reduce(
      (sum, s) => sum + Number(s.total || 0),
      0
    );

    const grand_total = Number(booking.room_total || 0) + services_total;

    // 4️⃣ Final response
    res.json({
      data: {
        ...booking,
        services: serviceRows,
        services_total,
        grand_total,
      },
    });

  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
