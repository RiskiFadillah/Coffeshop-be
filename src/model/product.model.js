const db = require("../../helper/connection");
// const { response } = require("../router");
const { v4: uuidv4 } = require("uuid");
const { array } = require("../../helper/formupload");
const { search } = require("../router");
// ${this.query(
//   queryParams,
//   queryParams.sortBy,
//   queryParams.limit,
//   queryParams.page
// )}
const productModel = {
  // query: (queryParams, sortType = "asc", limit = 5, page) => {
  //   if (queryParams.search && queryParams.cat) {
  //     return `WHERE title ILIKE '%${
  //       queryParams.search
  //     }%' AND category ILIKE '%${
  //       queryParams.cat
  //     }%' ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
  //       page * limit - limit
  //     }`;
  //   } else if (queryParams.search || queryParams.cat) {
  //     return `WHERE title ILIKE '%${queryParams.search}%' OR category ILIKE '%${
  //       queryParams.cat
  //     }%' ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
  //       page * limit - limit
  //     }`;
  //   } else {
  //     return `ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
  //       page * limit - limit
  //     }`;
  //   }
  // },
  get: function (queryParams) {
    // console.log(queryParams);
    const {page=1,limit = 15, search=''} = queryParams
    return new Promise((resolve, reject) => {
      db.query(
        ` SELECT 
        products.id, products.title, products.price, products.category,  
        json_agg(row_to_json(product_image)) images
        FROM products
        INNER JOIN product_image ON products.id=product_image.id_product
       ${search && `AND title ILIKE '%${search}%'`}
        GROUP BY products.id LIMIT ${limit} OFFSET (${page}-1)*${limit} `,
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
      db.query(`SELECT p.id,p.title,p.price,p.category,json_agg(row_to_json(i)) images FROM products AS p LEFT JOIN (SELECT * FROM product_image) AS i ON p.id=i.id_product WHERE p.id = '${id}' GROUP BY p.id`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  add: ({ title, img, price, category, file }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO Products (id,title,img,price,category) VALUES('${uuidv4()}','${title}','${img}','${price}','${category}') RETURNING id`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            for (let index = 0; index < file.length; index++) {
              console.log(index, "dslkadalda");
              db.query(
                `INSERT INTO product_image (id_images,id_product,name,filename) VALUES($1,$2,$3,$4)`,
                [uuidv4(), result.rows[0].id, title, file[index].filename]
              );
            }
            return resolve({ title, img, price, category, files: file });
          }
        }
      );
    });
  },
  update: ({ id, title, img, price, category, file }) => {
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
                return reject(err.message);
              } else {
                if (file.length <= 0) {
                  return resolve({ id, title, img, price, category });
                }
                db.query(
                  `SELECT id_images,filename FROM product_image WHERE id_product='${id}'`,
                  (errdataImage, imagedata) => {
                    if (errdataImage)
                      return reject({ message: errdataImage.message });

                    if (file.length > imagedata.rowCount) {
                      return reject("Tidak bisa mengpload image lagi");
                    } else {
                      for (
                        let indexNew = 0;
                        indexNew < file.length;
                        indexNew++
                      ) {
                        console.log(indexNew)
                        db.query(
                          `UPDATE product_image SET filename=$1 WHERE id_images=$2`,
                          [
                            file[indexNew].filename,
                            imagedata.rows[indexNew].id_image,
                          ],

                          (err, result) => {
                            if (err)
                              return reject({
                                message: "image fail to delete",
                              });
                            return resolve({
                              id,
                              title,
                              img,
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
