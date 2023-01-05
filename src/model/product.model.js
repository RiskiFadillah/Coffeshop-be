const db = require("../../helper/connection");
// const { response } = require("../router");
const { v4: uuidv4 } = require("uuid");

const productModel = {
  query: (queryParams, sortType = "asc", limit = 5, page) => {
    if (queryParams.search && queryParams.cat) {
      return `WHERE title ILIKE '%${
        queryParams.search
      }%' AND category ILIKE '%${
        queryParams.cat
      }%' ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    } else if (queryParams.search || queryParams.cat) {
      return `WHERE title ILIKE '%${queryParams.search}%' OR category ILIKE '%${
        queryParams.cat
      }%' ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    } else {
      return `ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
        page * limit - limit
      }`;
    }
  },
  get: function (queryParams) {
    // console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from products ${this.query(
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
      db.query(`SELECT * from products WHERE id = '${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  add: ({ title, img, price, category }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO Products (id,title,img,price,category) VALUES('${uuidv4()}','${title}','${img}','${price}','${category}')`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve({ title, img, price, category });
          }
        }
      );
    });
  },
  update: ({ id, title, img, price, category }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM products WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          db.query(
            `UPDATE products SET title ='${
              title || result.rows[0].title
            }',img='${img || result.rows[0].img}',price='${
              price || result.rows[0].price
            }',category='${
              category || result.rows[0].category
            }' WHERE id = '${id}'`,
            (err, result) => {
              if (err) {
                return reject(err);
              } else {
                return resolve({ id, title, img, price, category });
              }
            }
          );
        }
      });
    });
  },
  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE from products WHERE id = '${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve({ message: `Success Delete data ${id}` });
        }
      });
    });
  },
};

module.exports = productModel;
