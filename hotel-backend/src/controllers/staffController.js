const {
  createStaff,
  getAll,
  getById,
  updateStaff,
  deleteStaff,
  findByEmail
} = require("../models/staffModel");

const { hashPassword } = require("../utils/bcryptHelper");
const { success, error } = require("../utils/responseHelper");


// GET ALL STAFF
async function listStaff(req, res) {
  try {
    const staff = await getAll();
    return success(res, staff);
  } catch (err) {
    return error(res, "Failed to fetch staff");
  }
}


// GET SINGLE STAFF
async function getStaff(req, res) {
  try {
    const staff = await getById(req.params.id);
    if (!staff) return error(res, "Staff not found", 404);
    return success(res, staff);
  } catch (err) {
    return error(res, "Failed to fetch staff");
  }
}


// CREATE STAFF
async function createStaffController(req, res) {
  try {
    const { name, email, password, role, phone, salary, hired_date } = req.body;

    if (!email || !password || !role)
      return error(res, "Email, password & role required", 400);

    const exists = await findByEmail(email);
    if (exists) return error(res, "Email already exists", 400);

    const hashed = await hashPassword(password);

    const id = await createStaff({
      name,
      email,
      password: hashed,
      role,
      phone,
      salary,
      hired_date
    });

    return success(res, { id }, "Staff created", 201);
  } catch (err) {
    return error(res, "Failed to create staff");
  }
}


// UPDATE STAFF
async function updateStaffController(req, res) {
  try {
    const id = req.params.id;
    const staff = await getById(id);

    if (!staff) return error(res, "Staff not found", 404);

    const payload = { ...req.body };

    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    await updateStaff(id, payload);

    return success(res, {}, "Staff updated");
  } catch (err) {
    return error(res, "Failed to update staff");
  }
}


// DELETE STAFF
async function deleteStaffController(req, res) {
  try {
    const id = req.params.id;

    const staff = await getById(id);
    if (!staff) return error(res, "Staff not found", 404);

    await deleteStaff(id);

    return success(res, {}, "Staff deleted");
  } catch (err) {
    return error(res, "Failed to delete staff");
  }
}


module.exports = {
  listStaff,
  getStaff,
  createStaff: createStaffController,
  updateStaff: updateStaffController,
  deleteStaff: deleteStaffController
};
