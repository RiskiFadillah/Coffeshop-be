const express = require("express");
const router = express();

//import contoller
const authController = require("../controller/auth.controller");

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
