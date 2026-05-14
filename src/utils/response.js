const success = (res, data = null, message = "OK", statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message = "Server xatosi.", statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

const paginated = (res, data, meta, message = "OK") => {
  return res.status(200).json({ success: true, message, data, meta });
};

module.exports = { success, error, paginated };
