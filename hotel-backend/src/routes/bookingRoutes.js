const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const { getBookingInvoice } = require("../controllers/bookingController");

const {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const { getByCustomer } = require("../models/bookingModel");
const { getPool } = require("../../config/db");
const { checkRoomAvailability } = require("../controllers/bookingController");

router.post(
  "/check-availability",
  checkRoomAvailability
);


// INVOICE
router.get(
  "/:id/invoice",
  auth,
  role(["admin", "manager"]),
  getBookingInvoice
);

// ─────────────────────────────────────────────
// CUSTOMER — GET ALL BOOKINGS (MyBookings page)
// GET /api/bookings/customer
// ─────────────────────────────────────────────
router.get(
  "/customer",
  auth,
  role(["customer", "admin", "manager"]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const rows = await getByCustomer(userId);

      return res.json({ data: rows });
    } catch (err) {
      console.error("Customer bookings error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);


// ─────────────────────────────────────────────
// CUSTOMER — GET FULL BOOKING DETAILS
// Used in: /payment/[booking_id]
// GET /api/bookings/customer/:id
// ─────────────────────────────────────────────
router.get(
  "/customer/:id",
  auth,
  role(["customer", "admin", "manager"]),
  async (req, res) => {
    try {
      const bookingId = req.params.id;
      const userId = req.user.id;

      const pool = getPool();

      const [rows] = await pool.query(
        `
        SELECT 
          b.*, 
          r.room_number,
          rt.type_name,
          rt.base_price
        FROM booking b
        JOIN room r ON b.room_id = r.room_id
        JOIN room_type rt ON r.type_id = rt.type_id
        WHERE b.booking_id = ? AND b.customer_id = ?
        `,
        [bookingId, userId]
      );

      if (rows.length === 0)
        return res.status(404).json({ message: "Booking not found" });

      return res.json({ data: rows[0] });

    } catch (err) {
      console.error("Customer Booking Fetch Error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);


// ─────────────────────────────────────────────
// ADMIN + MANAGER — GET ALL BOOKINGS
// ─────────────────────────────────────────────
router.get("/", auth, role(["admin", "manager"]), listBookings);


// ─────────────────────────────────────────────
// ADMIN + MANAGER — GET ONE BOOKING
// ─────────────────────────────────────────────
router.get("/:id", auth, role(["admin", "manager"]), getBooking);


// ─────────────────────────────────────────────
// CUSTOMER + ADMIN — CREATE BOOKING
// ─────────────────────────────────────────────
router.post("/", auth, role(["customer", "admin"]), createBooking);


// ─────────────────────────────────────────────
// ADMIN + MANAGER — UPDATE BOOKING
// ─────────────────────────────────────────────
router.put("/:id", auth, role(["admin", "manager"]), updateBooking);


// ─────────────────────────────────────────────
// ADMIN — DELETE BOOKING
// ─────────────────────────────────────────────
router.delete("/:id", auth, role(["admin"]), deleteBooking);




module.exports = router;


// ADMIN — Cancel a booking
router.post("/:id/cancel", auth, role(["admin","manager"]), async (req, res) => {
  try {
    const id = req.params.id;
    const { updateBooking, getById } = require("../models/bookingModel");
    
    const booking = await getById(id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    await updateBooking(id, { booking_status: "cancelled" });

    return res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Cancel failed" });
  }
});


// ADMIN — Mark a booking as paid
router.post("/:id/mark-paid", auth, role(["admin","manager"]), async (req, res) => {
  try {
    const id = req.params.id;
    const { updateBooking, getById } = require("../models/bookingModel");

    const booking = await getById(id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    await updateBooking(id, { booking_status: "paid" });

    return res.json({ success: true, message: "Booking marked as paid" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Mark-paid failed" });
  }
});








