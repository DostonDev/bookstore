const service = require("./analytics.service");
const { success, error } = require("../../utils/response");

const getAdminStats = async (req, res) => {
  try {
    const data = await service.getAdminStats();
    return success(res, data);
  } catch (err) {
    console.error("[analytics]", err);
    return error(res, err.message, err.status || 500);
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const data = await service.getUserDashboard(req.user.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { getAdminStats, getUserDashboard };
