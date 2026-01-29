const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listFeedback,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");

// Get all feedback (admin + manager)
router.get("/", auth, role(["admin", "manager"]), listFeedback);

// Get single feedback
router.get("/:id", auth, role(["admin", "manager", "customer"]), getFeedback);

// Create feedback (customer only)
router.post("/", auth, role(["customer"]), createFeedback);

// Update feedback (customer edits his own OR admin)
router.put("/:id", auth, role(["admin", "customer"]), updateFeedback);

// Delete feedback (admin only)
router.delete("/:id", auth, role(["admin"]), deleteFeedback);

module.exports = router;
