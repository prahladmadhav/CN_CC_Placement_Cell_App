const express = require("express");
const router = express.Router();
const passport = require("passport");
const studentController = require("../controllers/student.controller");

router.get("/", studentController.viewAll);
router.get("/:id", studentController.profile);
router.post("/create", passport.checkAuthentication, studentController.create);
router.get("/destroy/:id", passport.checkAuthentication, studentController.destroy);
router.post("/edit/:id", passport.checkAuthentication, studentController.edit);

module.exports = router;
