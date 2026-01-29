const { getAll } = require('../models/bookingModel');
async function listAllBookings() {
  return getAll();
}
module.exports = { listAllBookings };
