const router = require("express").Router();
const ctrl = require("./analytics.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");

router.get("/admin", authenticate, requireAdmin, ctrl.getAdminStats);
router.get("/dashboard", authenticate, ctrl.getUserDashboard);

module.exports = router;
