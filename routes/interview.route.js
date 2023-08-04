const express = require("express");
const router = express.Router();
const passport = require("passport");
const interviewController = require("../controllers/interview.controller");

router.get("/", interviewController.viewAll);
router.get("/:id", interviewController.single);
router.post("/create", passport.checkAuthentication, interviewController.create);
router.get("/destroy/:id", passport.checkAuthentication, interviewController.destroy);
router.post("/edit/:id", passport.checkAuthentication, interviewController.edit);

module.exports = router;
