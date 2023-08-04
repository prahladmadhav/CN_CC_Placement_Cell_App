const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");

router.get("/", homeController.home);
router.use("/users", require("./user.route"));
router.use("/student", require("./student.route"));
router.use("/interview", require("./interview.route"));
router.use("/result", require("./result.route"));

module.exports = router;
