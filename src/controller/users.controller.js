const usersModel = require("../model/users.model");

const usersController = {
  get: (req, res) => {
    return usersModel
      .get(req.query)
      .then((result) => {
        return res.status(200).send({ message: "Success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error.message });
      });
  },
  getDetail: (req, res) => {
    return usersModel
      .getDetail(req.params.id)
      .then((result) => {
        return res.status(201).send({ message: "Success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error.message });
      });
  },

  add: (req, res) => {
    if (
      req.body.name === "" ||
      req.body.email === "" ||
      req.body.phone_number
    ) {
      return res
        .status(400)
        .send({ message: "Data Name, Email and Phone Number must fill" });
    } else {
      return usersModel
        .add(req.body)
        .then((result) => {
          return res.status(201).send({ message: "Success", data: result });
        })
        .catch((error) => {
          return res.status(500).send({ message: error.message });
        });
    }
  },
  update: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    return usersModel
      .update(request)
      .then((result) => {
        return res.status(201).send({ message: "Success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  remove: (req, res) => {
    return usersModel
      .remove(req.params.id)
      .then((result) => {
        return res.status(201).send({ message: "Success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error.message });
      });
  },
};

module.exports = usersController;
