const express = require("express");
const router = express.Router();
const passport = require("passport");
const resultController = require("../controllers/result.controller");

router.get("/", resultController.viewAll);
router.get("/download", resultController.download);
router.get("/:id", resultController.single);
router.post("/create", passport.checkAuthentication, resultController.create);
router.get("/destroy/:id", passport.checkAuthentication, resultController.destroy);
router.post("/edit/:id", passport.checkAuthentication, resultController.edit);

module.exports = router;
