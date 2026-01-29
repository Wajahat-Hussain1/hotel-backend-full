const { getAll } = require('../models/paymentModel');
async function listAllPayments() {
  return getAll();
}
module.exports = { listAllPayments };
