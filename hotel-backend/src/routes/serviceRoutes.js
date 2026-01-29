const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listServices,
  getService,
  createService,
  updateService,
  deleteService
} = require("../controllers/serviceController");

// GET all services
router.get("/", listServices);

// GET single service
router.get("/:id", getService);

// Create service (admin only)
router.post("/", auth, role(["admin"]), createService);

// Update service (admin only)
router.put("/:id", auth, role(["admin"]), updateService);

// Delete service (admin only)
router.delete("/:id", auth, role(["admin"]), deleteService);

module.exports = router;
