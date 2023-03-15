const express = require("express");
const verifyToken = require("../../helper/verifyToken");
const router = express();
const formUploadOnline = require("../../helper/formupload");

//import contoller
const productController = require("../controller/product.controller");

router.get("/", productController.get);
router.get("/:id", productController.getDetail);
router.post(
  "/",
  verifyToken,
  formUploadOnline.array("img"),
  productController.add
);

router.patch(
  "/:id",
  verifyToken,
  formUploadOnline.array("img"),
  productController.update
);
router.delete("/:id", verifyToken, productController.remove);

module.exports = router;
