const productModel = require("../model/product.model");
const { unlink } = require("node:fs");

const Pagination = {
  page: (page, limit) => {
    let result = (page - 1) * limit + 1;
    return result ? result : 0;
  },
};

const productController = {
  get: (req, res) => {
    let { search, category, sortBy, page, limit } = req.query;
    let offset = Pagination.page(page, limit);
    return productModel
      .get(search, category, sortBy, limit, offset)
      .then((result) => {
        return res.status(200).send({ message: "success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  getDetail: (req, res) => {
    return productModel
      .getDetail(req.params.id)
      .then((result) => {
        return res.status(201).send({ message: "Success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error.message });
      });
  },

  add: (req, res) => {
    const request = {
      ...req.body,
      file: req.files,
    };

    if (
      req.body.title === "" ||
      req.body.price === "" ||
      req.body.category === "" ||
      req.body.img === "" ||
      req.body.description === "" ||
      req.body.size === "" ||
      req.body.stock === ""
    ) {
      return res
        .status(400)
        .send({ message: "name,price,category dan img harus diisi" });
    } else {
      return productModel
        .add(request)
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
      file: req.files,
    };
    // console.log(request);
    return productModel
      .update(request)
      .then((result) => {
        if (typeof result.oldImages != "undefined") {
          for (let index = 0; index < result.oldImages.length; index++) {
            console.log(result.oldImages[index].filename);
            unlink(
              `public/uploads/images/${result.oldImages[index].filename}`,
              (err) => {
                console.log(
                  `successfully deleted ${result.oldImages[index].filename}`
                );
              }
            );
          }
        }
        return res.status(201).send({ message: "succes", data: result });
        // return formResponse(201, "success", result, res)
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
        // return formResponse(500, error)
      });
  },
  remove: (req, res) => {
    return productModel
      .remove(req.params.id)
      .then((result) => {
        for (let index = 0; index < result.length; index++) {
          unlink(`public/uploads/images/${result[index].filename}`, (err) => {
            //if (err) throw err;
            console.log(`successfully deleted ${result[index.filename]}`);
          });
        }

        return res.status(201).send({ message: "Success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error.message });
      });
  },
};

module.exports = productController;
