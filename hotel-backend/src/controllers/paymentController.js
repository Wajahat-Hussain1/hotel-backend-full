




const { getPool } = require("./../../config/db");
const {
  createPayment: createPaymentModel,
  getById: getPaymentModel,
  getByBooking: getPaymentByBooking
} = require("../models/paymentModel");

const {
  getById: getBookingById,
  updateBooking
} = require("../models/bookingModel");

const { success, error } = require("../utils/responseHelper");


// ---------------------------------------------
// LIST PAYMENTS
// ---------------------------------------------
// async function listPayments(req, res) {
//   try {
//     const payments = await getPool()
//       .query(`
//         SELECT p.*, b.check_in, b.check_out, b.total_price 
//         FROM payment p
//         JOIN booking b ON p.booking_id = b.booking_id
//         ORDER BY p.payment_id DESC
//       `)
//       .then(r => r[0]);

//     return success(res, payments);
//   } catch (err) {
//     console.error(err);
//     return error(res, "Failed to fetch payments");
//   }
// }


async function listPayments(req, res) {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT 
        b.booking_id,
        b.customer_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.booking_status,
        b.created_at,

        p.payment_id,
        p.amount,
        p.payment_method,
        p.payment_status,
        p.cancel_until,
        p.created_at AS payment_created
      FROM booking b
      LEFT JOIN payment p ON b.booking_id = p.booking_id
      ORDER BY b.booking_id DESC
    `);

    return success(res, rows);
  } catch (err) {
    console.error(err);
    return error(res, "Failed to fetch payments");
  }
}


// ---------------------------------------------
// GET PAYMENT
// ---------------------------------------------
async function getPayment(req, res) {
  try {
    const payment = await getPaymentModel(req.params.id);
    if (!payment) return error(res, "Payment not found", 404);
    return success(res, payment);
  } catch (err) {
    console.error(err);
    return error(res, "Failed to fetch payment");
  }
}


// ---------------------------------------------
// CANCEL PAYMENT (customer)
// ---------------------------------------------
const cancelPayment = async (req, res) => {
  try {
    const booking_id = req.params.booking_id;
    const userId = req.user.id;

    const pool = getPool();

    // Validate booking
    const [bookings] = await pool.query(
      `SELECT * FROM booking WHERE booking_id = ? AND customer_id = ?`,
      [booking_id, userId]
    );
    if (bookings.length === 0)
      return error(res, "Booking not found", 404);

    const booking = bookings[0];

    // Get payment
    const [payments] = await pool.query(
      `SELECT * FROM payment WHERE booking_id = ? ORDER BY payment_id DESC LIMIT 1`,
      [booking_id]
    );
    if (payments.length === 0)
      return error(res, "No payment found", 404);

    const payment = payments[0];

    // Check time window
    const now = new Date();
    const cancelUntil = new Date(payment.cancel_until);
    if (now > cancelUntil)
      return error(res, "Cancel window expired", 403);

    // Reverse booking
    await pool.query(
      `UPDATE booking SET booking_status = 'pending' WHERE booking_id = ?`,
      [booking_id]
    );

    // Refund payment
    await pool.query(
      `UPDATE payment SET payment_status = 'refunded' WHERE payment_id = ?`,
      [payment.payment_id]
    );

    return success(res, {}, "Payment cancelled and refunded");
  } catch (err) {
    console.error("Cancel Error:", err);
    return error(res, "Payment cancellation failed");
  }
};


// ---------------------------------------------
// CREATE PAYMENT
// ---------------------------------------------
async function createPayment(req, res) {
  try {
    const { booking_id, amount, payment_method } = req.body;
    const user = req.user;

    if (!booking_id || !amount || !payment_method)
      return error(res, "Required fields missing", 400);

    // Check booking
    const booking = await getBookingById(booking_id);
    if (!booking) return error(res, "Booking not found", 404);

    // Check access
    if (user.role === "customer" && booking.customer_id !== user.id)
      return error(res, "Unauthorized", 403);

    // Prevent duplicate paid payments
    const payments = await getPaymentByBooking(booking_id);
    if (payments.some(p => p.payment_status === "paid"))
      return error(res, "Booking already paid", 409);

    // Create payment
    const paymentId = await createPaymentModel({
      booking_id,
      amount,
      payment_method,
      payment_status: "paid"
    });

    // Update booking
    await updateBooking(booking_id, {
      booking_status: "paid",
      total_price: amount
    });

    return success(res, { payment_id: paymentId }, "Payment successful", 201);
  } catch (err) {
    console.error("Payment create error:", err);
    return error(res, "Payment failed");
  }
}


// ---------------------------------------------
// UPDATE PAYMENT
// ---------------------------------------------
// async function updatePayment(req, res) {
//   try {
//     const id = req.params.id;
//     const payload = req.body;

//     await getPool().query(
//       `UPDATE payment SET ${Object.keys(payload)
//         .map(k => `${k} = ?`)
//         .join(", ")} WHERE payment_id = ?`,
//       [...Object.values(payload), id]
//     );

//     return success(res, {}, "Payment updated");
//   } catch (err) {
//     console.error(err);
//     return error(res, "Failed to update payment");
//   }
// }

// ---------------------------------------------
// UPDATE PAYMENT (SAFE DATE HANDLING)
// ---------------------------------------------
async function updatePayment(req, res) {
  try {
    const id = req.params.id;
    let payload = { ...req.body };

    // Fix: Convert ISO datetime → MySQL DATETIME (YYYY-MM-DD HH:mm:ss)
    const fixDate = (val) => {
      if (!val) return null;
      const d = new Date(val);
      if (isNaN(d)) return null;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };

    if (payload.cancel_until)
      payload.cancel_until = fixDate(payload.cancel_until);

    if (payload.created_at)
      payload.created_at = fixDate(payload.created_at);

    // Build SQL dynamically
    const fields = Object.keys(payload)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(payload), id];

    await getPool().query(
      `UPDATE payment SET ${fields} WHERE payment_id = ?`,
      values
    );

    return success(res, {}, "Payment updated successfully");
  } catch (err) {
    console.error("UPDATE PAYMENT ERROR:", err);
    return error(res, "Failed to update payment");
  }
}

// // ---------------------------------------------
// // DELETE PAYMENT
// // ---------------------------------------------

// async function deletePayment(req, res) {
//   try {
//     const id = req.params.id;
//     const pool = getPool();

//     // 1️⃣ Get payment first
//     const [payRows] = await pool.query(
//       `SELECT * FROM payment WHERE payment_id = ?`,
//       [id]
//     );

//     if (payRows.length === 0)
//       return error(res, "Payment not found", 404);

//     const payment = payRows[0];

//     // 2️⃣ Delete payment
//     await pool.query(`DELETE FROM payment WHERE payment_id = ?`, [id]);

//     // 3️⃣ Delete booking associated with this payment
//     await pool.query(
//       `DELETE FROM booking WHERE booking_id = ?`,
//       [payment.booking_id]
//     );

//     return success(res, {}, "Payment and booking deleted");
//   } catch (err) {
//     console.error(err);
//     return error(res, "Failed to delete payment");
//   }
// }

async function deletePayment(req, res) {
  try {
    const id = req.params.id;
    const pool = getPool();

    // 1️⃣ Get payment record
    const [payRows] = await pool.query(
      `SELECT * FROM payment WHERE payment_id = ?`,
      [id]
    );

    if (payRows.length === 0)
      return error(res, "Payment not found", 404);

    const bookingId = payRows[0].booking_id;

    // 2️⃣ Delete from service_order FIRST
    await pool.query(
      `DELETE FROM service_order WHERE booking_id = ?`,
      [bookingId]
    );

    // 3️⃣ Delete from feedback
    await pool.query(
      `DELETE FROM feedback WHERE booking_id = ?`,
      [bookingId]
    );

    // 4️⃣ Delete payment
    await pool.query(
      `DELETE FROM payment WHERE payment_id = ?`,
      [id]
    );

    // 5️⃣ Delete booking
    await pool.query(
      `DELETE FROM booking WHERE booking_id = ?`,
      [bookingId]
    );

    return success(res, {}, "Payment + Booking + Related Records Deleted Successfully");

  } catch (err) {
    console.error("DELETE PAYMENT ERROR:", err);
    return error(res, "Failed to delete payment");
  }
}


// ---------------------------------------------
// VIEW PAYMENT FULL DETAILS
// ---------------------------------------------
const viewPaymentDetails = async (req, res) => {
  try {
    const payment_id = req.params.id;
    const pool = getPool();

    // Payment
    const [paymentRows] = await pool.query(
      `SELECT * FROM payment WHERE payment_id = ?`,
      [payment_id]
    );
    if (paymentRows.length === 0)
      return error(res, "Payment not found", 404);

    const payment = paymentRows[0];

    // Booking
    const [bookingRows] = await pool.query(
      `SELECT * FROM booking WHERE booking_id = ?`,
      [payment.booking_id]
    );
    const booking = bookingRows[0];

    // Customer
    const [customerRows] = await pool.query(
      `SELECT customer_id, first_name, last_name, email, created_at, status 
       FROM customer WHERE customer_id = ?`,
      [booking.customer_id]
    );
    const customer = customerRows[0];

    // Room
    const [roomRows] = await pool.query(
      `SELECT r.room_id, r.room_number, r.status AS room_status,
              t.type_name, t.base_price, t.capacity
       FROM room r
       LEFT JOIN room_type t ON r.type_id = t.type_id
       WHERE r.room_id = ?`,
      [booking.room_id]
    );
    const room = roomRows[0];

    return success(res, {
      payment,
      booking,
      customer,
      room
    });

  } catch (err) {
    console.error("VIEW PAYMENT ERROR:", err);
    return error(res, "Failed to load payment details");
  }
};












// ---------------------------------------------
// CONFIRM STRIPE PAYMENT (after success redirect)
// ---------------------------------------------
const confirmStripePayment = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const user = req.user;

    if (!booking_id) {
      return error(res, "Booking ID required", 400);
    }

    const booking = await getBookingById(booking_id);
    if (!booking) {
      return error(res, "Booking not found", 404);
    }

    // security check (customer can confirm only own booking)
    if (user.role === "customer" && booking.customer_id !== user.id) {
      return error(res, "Unauthorized", 403);
    }

    // prevent double payment
    const payments = await getPaymentByBooking(booking_id);
    if (payments.some(p => p.payment_status === "paid")) {
      return success(res, {}, "Already confirmed");
    }

    // create payment record
    await createPaymentModel({
      booking_id,
      amount: booking.total_price,
      payment_method: "stripe",
    });

    // update booking
    await updateBooking(booking_id, {
      booking_status: "paid",
    });

    return success(res, {}, "Payment confirmed & booking updated");

  } catch (err) {
    console.error("CONFIRM PAYMENT ERROR:", err);
    return error(res, "Payment confirmation failed");
  }
};


// ---------------------------------------------
// EXPORTS
// ---------------------------------------------
module.exports = {
  viewPaymentDetails,
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  cancelPayment,
  confirmStripePayment, // ✅ ADD THIS
};
