const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;

const verifyToken = (req, rest, next) => {
  const token = req.header("token");

  if (!req.header("token")) {
    return rest.status(400).send({
      message: "token is required",
    });
  } else {
    jwt.verify(token, JWT_PRIVATE_KEY, function (err, decoded) {
      if (!err) {
        console.log(decoded);
        if (decoded.role === "admin") {
          next();
        } else if (decoded.role === "users") {
          return rest.status(403).send({
            message: "anda tidak memiliki akses",
          });
        }
      } else {
        if (err) {
          return rest.status(400).send({
            message: "token tidak valid",
          });
        }
      }
    });
  }
};

module.exports = verifyToken;
