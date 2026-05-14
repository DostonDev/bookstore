const router = require("express").Router();
const ctrl = require("./blogs.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");
const { uploadImage } = require("../../utils/multer");

router.get("/", ctrl.getAll);
router.get("/admin", authenticate, requireAdmin, ctrl.getAllAdmin);
router.get("/:slug", ctrl.getBySlug);
router.post("/", authenticate, requireAdmin, uploadImage.single("featuredImage"), ctrl.create);
router.put("/:id", authenticate, requireAdmin, uploadImage.single("featuredImage"), ctrl.update);
router.delete("/:id", authenticate, requireAdmin, ctrl.remove);

module.exports = router;
