// src/routes/adminStatsRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const { getDashboardStats, getRecentBookings } = require("../controllers/adminStatsController");

// secured — only admin & manager
router.get("/dashboard", auth, role(["admin","manager"]), getDashboardStats);
router.get("/recent-bookings", auth, role(["admin","manager"]), getRecentBookings);

module.exports = router;
