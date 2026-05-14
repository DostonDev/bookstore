const router = require("express").Router();
const ctrl = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { registerRules, loginRules } = require("./auth.validation");

router.post("/register", registerRules, validate, ctrl.register);
router.post("/login", loginRules, validate, ctrl.login);
router.get("/me", authenticate, ctrl.getMe);

module.exports = router;
