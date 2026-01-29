function success(res, data = {}, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

function error(res, message = 'Error', status = 500) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, error };
