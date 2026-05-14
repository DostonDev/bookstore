const router = require("express").Router();
const ctrl = require("./users.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");
const { uploadImage } = require("../../utils/multer");

router.get("/profile", authenticate, ctrl.getProfile);
router.patch("/profile/avatar", authenticate, uploadImage.single("avatar"), ctrl.uploadAvatar);
router.get("/downloads", authenticate, ctrl.getDownloadHistory);
router.get("/", authenticate, requireAdmin, ctrl.getAllUsers);
router.get("/all", authenticate, requireAdmin, ctrl.getAllUsers);

module.exports = router;
