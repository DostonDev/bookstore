const router = require("express").Router();
const ctrl = require("./categories.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");
const { uploadImage } = require("../../utils/multer");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, requireAdmin, uploadImage.single("image"), ctrl.create);
router.put("/:id", authenticate, requireAdmin, uploadImage.single("image"), ctrl.update);
router.delete("/:id", authenticate, requireAdmin, ctrl.remove);

module.exports = router;
