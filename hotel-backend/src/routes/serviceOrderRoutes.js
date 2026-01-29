const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listServiceOrders,
  getServiceOrder,
  getOrdersByBooking,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder
} = require("../controllers/serviceOrderController");

// GET all service orders (admin + manager)
router.get("/", auth, role(["admin", "manager"]), listServiceOrders);

// GET single service order
router.get("/:id", auth, role(["admin", "manager"]), getServiceOrder);

// GET service orders by booking id
router.get(
  "/booking/:bookingId",
  auth,
  role(["admin", "manager", "customer"]),
  getOrdersByBooking
);

// Create service order (customer + admin + manager)
router.post("/", auth, role(["admin", "manager", "customer"]), createServiceOrder);

// Update service order (admin + manager)
router.put("/:id", auth, role(["admin", "manager"]), updateServiceOrder);

// Delete service order (admin only)
router.delete("/:id", auth, role(["admin"]), deleteServiceOrder);

module.exports = router;
