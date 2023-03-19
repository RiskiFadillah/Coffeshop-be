const db = require("../../helper/connection");
// const { response } = require("../router");
const { v4: uuidv4 } = require("uuid");
const { array } = require("../../helper/formupload");

const productModel = {
  query: (search, category, sortBy, limit, offset) => {
    let orderQuery = `ORDER BY title ${sortBy} LIMIT ${limit} OFFSET ${offset}`;

    if (search && category) {
      return `WHERE title LIKE '%${search}%' AND category LIKE '${category}%' ${orderQuery}`;
    } else if (search || category) {
      return `WHERE title LIKE '%${search}%' OR category LIKE '${category}%' ${orderQuery}`;
    } else {
      return orderQuery;
    }
  },
  whereSearchAndCategory: (search, category) => {
    if (search && category) {
      return `WHERE products.title ILIKE '%${search}%' AND category ILIKE '${category}%'`;
    } else if (search || category) {
      return `WHERE products.title ILIKE '%${search}%' OR category ILIKE '${category}%'`;
    } else {
      return "";
    }
  },

  orderAndGroup: (sortBy, limit, offset) => {
    return `GROUP BY products.id ORDER BY title ${sortBy} LIMIT ${limit} OFFSET ${offset}`;
  },

  get: function (search, category, sortBy = "ASC", limit = 20, offset = 0) {
    // console.log(queryParams);

    return new Promise((resolve, reject) => {
      db.query(
        ` SELECT 
        products.id, products.title, products.price, products.category,  
        json_agg(row_to_json(product_image)) images
        FROM products
        INNER JOIN product_image ON products.id=product_image.id_product
        ${this.whereSearchAndCategory(search, category)}
        ${this.orderAndGroup(sortBy, limit, offset)} `,
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
      db.query(
        `SELECT p.id,p.title,p.price,p.category,json_agg(row_to_json(i)) images FROM products AS p LEFT JOIN (SELECT * FROM product_image) AS i ON p.id=i.id_product WHERE p.id = '${id}' GROUP BY p.id`,
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
  add: ({
    title,
    img,
    price,
    category,
    description,
    size,
    delivery,
    stock,
    file,
  }) => {
    return new Promise((resolve, reject) => {
      console.log(
        {
          title,
          img,
          price,
          category,
          description,
          size,
          delivery,
          stock,
          file,
        },
        "halo"
      );
      db.query(
        `INSERT INTO Products (id,title,img,price,category,description,size,delivery,stock,file) VALUES('${uuidv4()}','${title}','${img}','${price}','${category}','${description}','${size}','${delivery}','${stock}','${file}') RETURNING id`,
        (err, result) => {
          console.log(err, "dslkadalda");
          if (err) {
            return reject(err.message);
          } else {
            for (let index = 0; index < file.length; index++) {
              db.query(
                `INSERT INTO product_image (id_images,id_product,name,filename) VALUES($1,$2,$3,$4)`,
                [uuidv4(), result.rows[0].id, title, file[index].path]
              );
            }
            return resolve({
              title,
              img,
              price,
              category,
              description,
              size,
              delivery,
              stock,
              files: file,
            });
          }
        }
      );
    });
  },
  update: ({
    id,
    title,
    img,
    price,
    category,
    delivery,
    description,
    file,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM products WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          if (result.rows.length == 0) {
            return reject("Id not Found");
          }
          db.query(
            `UPDATE products SET title ='${
              title || result.rows[0].title
            }',img='${img || result.rows[0].img}',price='${
              price || result.rows[0].price
            }',category='${category || result.rows[0].category}',delivery='${
              delivery || result.rows[0].delivery
            }',description='${
              description || result.rows[0].description
            }' WHERE id = '${id}'`,
            (err, result) => {
              if (err) {
                return reject(err.message);
              } else {
                if (file.length <= 0) {
                  return resolve({
                    id,
                    title,
                    img,
                    price,
                    category,
                    delivery,
                    description,
                  });
                }
                db.query(
                  `SELECT id_images,filename FROM product_image WHERE id_product='${id}'`,
                  (errdataImage, imagedata) => {
                    if (errdataImage) {
                      return reject({ message: errdataImage.message });
                    } else if (imagedata.rows.length < file.length) {
                      return reject(
                        "sorry:(...for now you can only upload images according to the previous number or lower"
                      );
                    } else {
                      for (
                        let indexNew = 0;
                        indexNew < file.length;
                        indexNew++
                      ) {
                        db.query(
                          `UPDATE product_image SET filename=$1 WHERE id_images=$2`,
                          [
                            file[indexNew].filename,
                            imagedata.rows[indexNew].id_images,
                          ],
                          (err, result) => {
                            if (err)
                              return reject({
                                message: "Failed delete image!",
                                error: err,
                              });
                            return resolve({
                              id,
                              title,
                              price,
                              category,
                              oldImages: imagedata.rows,
                              images: file,
                            });
                          }
                        );
                      }
                    }
                  }
                );
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
          db.query(
            `DELETE FROM product_image WHERE id_product='${id}' RETURNING filename`,
            (err, result) => {
              if (err) {
                return reject({ message: "image fail to delete" });
              } else {
                return resolve(result.rows);
              }
            }
          );
        }
      });
    });
  },
};

module.exports = productModel;
