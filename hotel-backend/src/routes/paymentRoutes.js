

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const { createCheckoutSession } = require("../controllers/stripeController");
const { confirmStripePayment } = require("../controllers/paymentController");

const {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  cancelPayment,
  viewPaymentDetails   // ✅ IMPORTED
} = require("../controllers/paymentController");

router.post(
  "/confirm",
  auth,
  role(["customer", "admin"]),
  confirmStripePayment
);

// STRIPE CHECKOUT
router.post(
  "/stripe/create-checkout-session",
  auth,
  role(["customer"]),
  createCheckoutSession
);


// -----------------------------------------
// ROUTES (Order is very important!!!)
// -----------------------------------------

// Cancel payment (customer only)
router.post("/cancel/:booking_id", auth, role(["customer"]), cancelPayment);

// VIEW PAYMENT DETAILS (admin + manager) — MUST BE BEFORE "/:id"
router.get("/view/:id", auth, role(["admin", "manager"]), viewPaymentDetails);

// GET all payments (admin + manager)
router.get("/", auth, role(["admin", "manager"]), listPayments);

// GET one payment
router.get("/:id", auth, role(["admin", "manager"]), getPayment);

// Create payment (customer + admin)
router.post("/", auth, role(["customer", "admin"]), createPayment);

// Update payment
router.put("/:id", auth, role(["admin", "manager"]), updatePayment);

// Delete payment
router.delete("/:id", auth, role(["admin"]), deletePayment);

module.exports = router;
