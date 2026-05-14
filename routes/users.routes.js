const { Router } = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { getProfile, getDownloadHistory, getAllUsers } = require("../controllers/users.controller");

const router = Router();

router.get("/profile", authenticate, getProfile);
router.get("/downloads", authenticate, getDownloadHistory);
router.get("/all", authenticate, authorize("ADMIN"), getAllUsers);

module.exports = router;
