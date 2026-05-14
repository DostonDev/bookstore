function success(res, data, message = "OK", statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

function error(res, message = "Server xatosi", statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}

module.exports = { success, error };
