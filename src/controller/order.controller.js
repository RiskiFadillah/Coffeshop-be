const orderModel = require("../model/order.model");

const orderController = {
  add: (req, res) => {
    const request = {
      ...req.body,
    };
    return orderModel
      .add(request)
      .then((result) => {
        return res.status(201).send({ message: "succes", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  getByUserId: (req, res) => {
    return orderModel
      .getByUserId(req.params.id_users)
      .then((result) => {
        return res.status(200).send({ message: "success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = orderController;
