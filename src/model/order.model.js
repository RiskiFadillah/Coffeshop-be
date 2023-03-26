const db = require("../../helper/connection");
const { v4: uuidv4 } = require("uuid");
const orderModel = {
  add: (order) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO order_products (id_order, user_id, quantity, total_price,product_id,delivery,time,product_image) VALUES ($1, $2, $3, $4, $5,$6,$7,$8) RETURNING *",
        [
          uuidv4(),
          order.user_id,
          order.quantity,
          order.total_price,
          order.id,
          order.delivery,
          order.time,
          order.product_image,
        ],
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

  getByUserId: (id_users) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT order_products.id_order, order_products.user_id, order_products.product_id, order_products.quantity, order_products.total_price,order_products.time,
        products.title, products.price, products.category,
        json_agg(json_build_object('filename', product_image.filename)) images
    FROM order_products
    INNER JOIN products ON  products.id = order_products.product_id
    INNER JOIN product_image ON products.id = product_image.id_product
    WHERE order_products.user_id='${id_users}'
    GROUP BY order_products.id_order, products.id;`,
        // [userId],
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else if (result.rowCount === 0) {
            return reject({ status: 404, message: "Not found" });
          } else {
            return resolve(result.rows);
          }
        }
      );
    });
  },
};

module.exports = orderModel;
