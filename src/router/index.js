// const { Router } = require("express");
const express = require("express");
const router = express();

const productRoute = require("./product.route");
const usersRoute = require("./users.route");
const authRoute = require("./auth.route");
const orderRoute = require("./order.route");

router.get("/", (req, res) => {
  return res.send("backend for coffe shop");
});

router.use("/Products", productRoute);
router.use("/users", usersRoute);
router.use("/auth", authRoute);
router.use("/order", orderRoute);

module.exports = router;
