const db = require("../../helper/connection");
// const { response } = require("../router");
const { v4: uuidv4 } = require("uuid");

const usersModel = {
  query: (queryParams, sortType = "asc", limit = 5, page) => {
    if (queryParams.search && queryParams.address) {
      return `WHERE username ILIKE '%${
        queryParams.search
      }%' AND address ILIKE '%${
        queryParams.address
      }%' ORDER BY username ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    } else if (queryParams.search || queryParams.address) {
      return `WHERE username ILIKE '%${
        queryParams.search
      }%' OR address ILIKE '%${
        queryParams.address
      }%' ORDER BY username ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    } else {
      return `ORDER BY username ${sortType} LIMIT ${limit} OFFSET ${
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
  getDetail: (id_users) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from users WHERE id_users = '${id_users}'`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.rows[0]);
          }
        }
      );
    });
  },

  // update: function ({
  //   id_users,
  //   username,
  //   password,
  //   email,
  //   address,
  //   file,
  //   phone_number,
  //   gender,
  // }) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT * FROM users WHERE id_users='${id_users}'`,
  //       (err, result) => {
  //         if (err) {
  //           return reject(err.message);
  //         } else {
  //           console.log(result);
  //           db.query(
  //             `UPDATE users SET username ='${
  //               username || result.rows[0].username
  //             }',password='${password || result.rows[0].password}', email='${
  //               email || result.rows[0].email
  //             }', address='${address || result.rows[0].address}', img='${
  //               file ? file.path : result.rows[0].img
  //             }', phone_number='${
  //               phone_number || result.rows[0].phone_number
  //             }', gender='${
  //               gender || result.rows[0].gender
  //             }' WHERE id_users = '${id_users}'`,
  //             (err, result) => {
  //               if (err) {
  //                 return reject(err);
  //               } else {
  //                 console.log(
  //                   id_users,
  //                   username,
  //                   password,
  //                   email,
  //                   address,
  //                   file,
  //                   phone_number,
  //                   gender
  //                 );
  //                 return resolve({
  //                   id_users,
  //                   username,
  //                   password,
  //                   email,
  //                   address,
  //                   img: file,
  //                   phone_number,
  //                   gender,
  //                 });
  //               }
  //             }
  //           );
  //         }
  //       }
  //     );
  //   });
  // },

  update: function ({
    id_users,
    username,
    password,
    email,
    address,
    file,
    phone_number,
    gender,
  }) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE id_users ='${id_users}'`,
        (error, dataRes) => {
          console.log(dataRes.rows);
          if (error) {
            return reject(error.message);
          } else {
            if (dataRes.rows.length == 0) {
              return reject("Id not found!");
            } else {
              db.query(
                `UPDATE users SET username='${
                  username || dataRes.rows[0].username
                }', email='${email || dataRes.rows[0].email}', password='${
                  password || dataRes.rows[0].password
                }',address='${address || dataRes.rows[0].address}' ,img='${
                  file ? file.path : dataRes.rows[0].img
                }', phone_number='${
                  phone_number || dataRes.rows[0].phone_number
                }', gender='${
                  gender || dataRes.rows[0].gender
                }' WHERE id_users='${id_users}'`,
                (error) => {
                  if (error) {
                    return reject(error.message);
                  } else {
                    return resolve({
                      id_users,
                      username,
                      password,
                      email,
                      address,
                      img: file,
                      phone_number,
                      gender,
                    });
                  }
                }
              );
            }
          }
        }
      );
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
