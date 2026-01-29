const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
} = require("../controllers/staffController");

// Only admin & manager can view staff
router.get("/", auth, role(["admin", "manager"]), listStaff);

// Single staff details
router.get("/:id", auth, role(["admin", "manager"]), getStaff);

// Only admin can add staff
router.post("/", auth, role(["admin"]), createStaff);

// Only admin can update staff
router.put("/:id", auth, role(["admin"]), updateStaff);

// Only admin can delete staff
router.delete("/:id", auth, role(["admin"]), deleteStaff);

module.exports = router;
