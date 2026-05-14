const { error } = require("../utils/response");

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, "Autentifikatsiya talab etiladi.", 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(
        res,
        `Bu amalni bajarish uchun sizda huquq yo'q. Talab etiladi: ${roles.join(" yoki ")}`,
        403
      );
    }

    next();
  };
}

module.exports = { authorize };
