const { getAll, createType } = require('../models/roomTypeModel');
const { success, error } = require('../utils/responseHelper');

async function listRoomTypes(req, res) {
  try {
    const rows = await getAll();
    return success(res, rows);
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch room types');
  }
}

async function createCustomRoomType(req, res) {
  try {
    const { type_name, base_price, capacity } = req.body;
    if (!type_name || !base_price) return error(res, 'Type name and base price required', 400);

    const newId = await createType({ type_name, base_price, capacity: capacity || 1 });

    // Return consistent shape: { success: true, data: { id: newId }, message: ... }
    return res.status(201).json({ success: true, data: { id: newId }, message: 'Room type created' });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to create room type');
  }
}

module.exports = { listRoomTypes, createCustomRoomType };
