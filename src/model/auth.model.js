const db = require("../../helper/connection");
// const { response } = require("../router");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const authModel = {
  login: ({ username, password }) => {
    console.log(username, password);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE username=$1`,
        [username],
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            if (result.rows.length == 0) {
              return reject("username/password salah"); //ketika username salah
            } else {
              bcrypt.compare(
                password,
                result.rows[0].password,
                function (err, hashingResult) {
                  if (err) return reject("username/password salah"); //ketika kesalaahan hashing bycrypt
                  if (hashingResult) {
                    return resolve(result.rows[0]);
                  } else {
                    return reject("username/password salah."); //ketika password salah
                  }
                }
              );
            }
          }
        }
      );
    });
  },
  register: ({ email, password, phone_number }) => {
    console.log(email, password, phone_number);
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (id_users,email,password,phone_number) VALUES($1,$2,$3,$4)`,
        [uuidv4(), email, password, phone_number],
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve({ email, password, phone_number });
          }
        }
      );
    });
  },
};

module.exports = authModel;
