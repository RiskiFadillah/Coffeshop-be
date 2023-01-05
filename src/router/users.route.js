const express = require("express");
const router = express();

//import contoller
const usersController = require("../controller/users.controller");

router.get("/", usersController.get);
router.get("/:id", usersController.getDetail);
router.post("/", usersController.add);
router.patch("/:id", usersController.update);
router.delete("/:id", usersController.remove);

module.exports = router;
