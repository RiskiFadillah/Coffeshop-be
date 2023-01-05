const express = require("express");
const router = express();

//import contoller
const productController = require("../controller/product.controller");

router.get("/", productController.get);
router.get("/:id", productController.getDetail);
router.post("/", productController.add);
// router.put("/", productController.update);
router.patch("/:id", productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
