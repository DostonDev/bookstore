const router = require("express").Router();
const ctrl = require("./books.controller");
const { authenticate, optionalAuth } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");
const { uploadBookFiles } = require("../../utils/multer");

router.get("/new", optionalAuth, ctrl.getNew);
router.get("/popular", optionalAuth, ctrl.getPopular);
router.get("/", optionalAuth, ctrl.getAll);
router.get("/:id/related", ctrl.getRelated);
router.get("/:id/download", authenticate, ctrl.download);
router.get("/:id", optionalAuth, ctrl.getById);

router.post("/", authenticate, requireAdmin,
  uploadBookFiles.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  ctrl.create
);
router.put("/:id", authenticate, requireAdmin,
  uploadBookFiles.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  ctrl.update
);
router.delete("/:id", authenticate, requireAdmin, ctrl.remove);

module.exports = router;
