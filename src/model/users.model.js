const db = require("../../helper/connection");
// const { response } = require("../router");
const { v4: uuidv4 } = require("uuid");

const usersModel = {
  query: (queryParams, sortType = "asc", limit = 5, page) => {
    if (queryParams.search && queryParams.address) {
      return `WHERE name ILIKE '%${queryParams.search}%' AND address ILIKE '%${
        queryParams.address
      }%' ORDER BY name ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    } else if (queryParams.search || queryParams.address) {
      return `WHERE name ILIKE '%${queryParams.search}%' OR address ILIKE '%${
        queryParams.address
      }%' ORDER BY name ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    } else {
      return `ORDER BY name ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    }
  },
  get: function (queryParams) {
    // console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from users ${this.query(
          queryParams,
          queryParams.sortBy,
          queryParams.limit,
          queryParams.page
        )}`,
        (err, result) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result.rows);
          }
        }
      );
    });
  },
  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from users WHERE id = '${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  add: ({ name, email, address, img, phone_number }) => {
    // console.log(name, email);
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (id,name,email,address,img,phone_number) VALUES('${uuidv4()}','${name}','${email}','${address}','${img}','${phone_number}')`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve({ name, email, address, img, phone_number });
          }
        }
      );
    });
  },
  update: ({ id, name, email, address, img, phone_number }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          db.query(
            `UPDATE users SET name ='${name || result.rows[0].name}', email='${
              email || result.rows[0].email
            }', address='${address || result.rows[0].address}', img='${
              img || result.rows[0].img
            }', phone_number='${
              phone_number || result.rows[0].phone_number
            }' WHERE id = '${id}'`,
            (err, result) => {
              if (err) {
                return reject(err);
              } else {
                return resolve({ id, name, email, address, img, phone_number });
              }
            }
          );
        }
      });
    });
  },
  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE from users WHERE id = '${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve({ message: `Success Delete data ${id}` });
        }
      });
    });
  },
};

module.exports = usersModel;
