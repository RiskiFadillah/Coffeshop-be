const express = require("express");
const formUploadOnline = require("../../helper/formupload");
const router = express();

//import contoller
const usersController = require("../controller/users.controller");

router.get("/", usersController.get);
router.get("/:id", usersController.getDetail);
router.post("/", usersController.add);
router.patch("/:id", formUploadOnline.single("img"), usersController.update);
router.delete("/:id", usersController.remove);

module.exports = router;
