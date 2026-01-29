const { findByUsername } = require('../models/adminModel');
const { success, error } = require('../utils/responseHelper');

async function getProfile(req, res) {
  try {
    const username = req.user.username;
    const admin = await findByUsername(username);
    if (!admin) return error(res, 'Admin not found', 404);
    delete admin.password;
    return success(res, admin);
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch admin');
  }
}

module.exports = { getProfile };
