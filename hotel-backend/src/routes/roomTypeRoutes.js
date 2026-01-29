const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listRoomTypes,
  createCustomRoomType,
} = require("../controllers/roomTypeController");

// GET all room types
router.get("/", listRoomTypes);

// CREATE custom room type (Admin only)
router.post(
  "/custom",
  auth,
  role(["admin"]),
  createCustomRoomType
);

module.exports = router;
