const express = require("express");
const verifyToken = require("../../helper/verifyToken");
const router = express();
const formUpload = require("../../helper/formupload");

//import contoller
const productController = require("../controller/product.controller");

router.get("/", productController.get);
router.get("/:id", productController.getDetail);
router.post("/", verifyToken, formUpload.array("img"), productController.add);
// router.put("/", productController.update);
router.patch(
  "/:id",
  verifyToken,
  formUpload.array("img"),
  productController.update
);
router.delete("/:id", verifyToken, productController.remove);

module.exports = router;
