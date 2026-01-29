const {
  createRoom,
  getAll,
  getById,
  updateRoom,
  deleteRoom
} = require("../models/roomModel");

const { success, error } = require("../utils/responseHelper");

// GET ALL
async function listRooms(req, res) {
  try {
    const rooms = await getAll();
    return success(res, rooms);
  } catch (err) {
    return error(res, "Failed to fetch rooms");
  }
}

// GET SINGLE
async function getRoom(req, res) {
  try {
    const room = await getById(req.params.id);
    if (!room) return error(res, "Room not found", 404);
    return success(res, room);
  } catch (err) {
    return error(res, "Failed to fetch room");
  }
}

// CREATE
async function createRoomController(req, res) {
  try {
    const { room_number, type_id, status } = req.body;

    if (!room_number || !type_id)
      return error(res, "Room number & type_id required", 400);

    const id = await createRoom({ room_number, type_id, status: status || 'available' });

    return success(res, { id }, "Room created", 201);
  } catch (err) {
    return error(res, "Failed to create room");
  }
}

// UPDATE
async function updateRoomController(req, res) {
  try {
    const id = req.params.id;
    const exist = await getById(id);

    if (!exist) return error(res, "Room not found", 404);

    await updateRoom(id, req.body);

    return success(res, {}, "Room updated");
  } catch (err) {
    return error(res, "Failed to update room");
  }
}

// DELETE
async function deleteRoomController(req, res) {
  try {
    const id = req.params.id;
    const exist = await getById(id);

    if (!exist) return error(res, "Room not found", 404);

    await deleteRoom(id);

    return success(res, {}, "Room deleted");
  } catch (err) {
    return error(res, "Failed to delete room");
  }
}

module.exports = {
  listRooms,
  getRoom,
  createRoom: createRoomController,
  updateRoom: updateRoomController,
  deleteRoom: deleteRoomController
};
