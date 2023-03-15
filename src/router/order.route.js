const express = require("express");
const router = express();
const formUpload = require("../../helper/formupload");
const orderController = require("../controller/order.controller");

router.post("/", formUpload.single("image"), orderController.add);
router.get("/:id_users", orderController.getByUserId);

module.exports = router;
