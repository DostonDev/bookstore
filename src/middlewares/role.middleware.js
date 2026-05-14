const { error } = require("../utils/response");

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return error(res, "Avtorizatsiya talab etiladi.", 401);
  if (!roles.includes(req.user.role)) return error(res, "Ruxsat yo'q.", 403);
  next();
};

const requireAdmin = requireRole("ADMIN");

module.exports = { requireRole, requireAdmin };
