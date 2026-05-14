const router = require("express").Router();
const ctrl = require("./tags.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");

router.get("/", ctrl.getAll);
router.get("/popular", ctrl.getPopular);
router.post("/", authenticate, requireAdmin, ctrl.create);
router.delete("/:id", authenticate, requireAdmin, ctrl.remove);

module.exports = router;
