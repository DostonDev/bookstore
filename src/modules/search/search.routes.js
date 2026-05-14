const router = require("express").Router();
const ctrl = require("./search.controller");

router.get("/", ctrl.search);
router.get("/autocomplete", ctrl.autocomplete);

module.exports = router;
