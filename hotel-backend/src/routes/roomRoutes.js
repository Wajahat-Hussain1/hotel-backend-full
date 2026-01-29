const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

// Public GET
router.get("/", listRooms);
router.get("/:id", getRoom);

// Admin only actions
router.post("/", auth, role(["admin"]), createRoom);
router.put("/:id", auth, role(["admin"]), updateRoom);
router.delete("/:id", auth, role(["admin"]), deleteRoom);

module.exports = router;
