require("dotenv").config();
const authModel = require("../model/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_PRIVATE_KEY } = process.env;

const authController = {
  login: (req, res) => {
    return authModel
      .login(req.body)
      .then((result) => {
        jwt.sign(
          {
            id: result.id,
            role: result.role,
          },
          JWT_PRIVATE_KEY,
          (err, tokenResult) => {
            return res.status(200).send({
              message: "Success",
              data: {
                user: {
                  id_users: result.id_users,
                  fullname: result.fullname,
                  img: result.img,
                  role: result.role,
                  username: result.username,
                },
                token: tokenResult,
              },
            });
          }
        );
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  register: (req, res) => {
    if (
      req.body.password === "" &&
      req.body.email === "" &&
      req.body.phone_number === ""
    ) {
      return res
        .status(400)
        .send({ message: "Password Email and Phone number must be fill" });
    } else if (req.body.password.length <= 6) {
      return res
        .status(400)
        .send({ message: "Password must more than 6 character" });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        } else {
          const request = {
            email: req.body.email,
            password: hash,
            phone_number: req.body.phone_number,
          };
          return authModel
            .register(request)
            .then((result) => {
              return res.status(201).send({ message: "Success", data: result });
            })
            .catch((error) => {
              return res.status(500).send({ message: error.message });
            });
        }
      });
    }
  },
};

module.exports = authController;
