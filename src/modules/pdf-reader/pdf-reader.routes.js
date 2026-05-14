const router = require("express").Router();
const ctrl = require("./pdf-reader.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.get("/progress", authenticate, ctrl.getUserProgress);
router.get("/:bookId/url", authenticate, ctrl.getReadUrl);
router.get("/:bookId/progress", authenticate, ctrl.getProgress);
router.put("/:bookId/progress", authenticate, ctrl.updateProgress);

module.exports = router;
