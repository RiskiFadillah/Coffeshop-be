require("dotenv").config();
const { urlencoded, json } = require("express");
const express = require("express");
const app = express();
const db = require("./helper/connection");
const router = require("./src/router/index");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

//static file
app.use(express.static("public"));

//Defaultnya Express js itu ga menerima semua jenis form
//use() middleware urlencoded, json
//menerima application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));
//menerima Json
app.use(json());
//Cors
app.use(cors());
app.use("/api/v1/", router);
//endpoint
// app.get("/Products/", (req, res) => {
//   //params
//   db.query(`SELECT * from products`, (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: err.message });
//     } else {
//       return res.status(200).send({ message: "Success", data: result.rows });
//     }
//   });
// });

// app.get("/Products/:id", (req, res) => {
//   //params dinamis
//   const { id } = req.params;
//   db.query(`SELECT * from products WHERE id = '${id}'`, (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: err.message });
//     } else {
//       return res.status(200).send({ message: "Success", data: result.rows[0] });
//     }
//   });
// });

// app.post("/Products", (req, res) => {
//   const { title, img, price, category } = req.body;
//   db.query(
//     `INSERT INTO Products (id,title,img,price,category) VALUES('${uuidv4()}','${title}','${img}','${price}','${category}')`,
//     (err, result) => {
//       if (err) {
//         return res.status(500).send({ message: err.message });
//       } else {
//         return res.status(201).send({ message: "Success", data: result });
//       }
//     }
//   );
// });
// app.put("/Products/:id", (req, res) => {
//   const { title, img, price, category } = req.body;
//   const { id } = req.params;
//   db.query(
//     `UPDATE products SET title ='${title}',img='${img}',price='${price}',category='${category}' WHERE id = '${id}'`,
//     (err, result) => {
//       if (err) {
//         return res.status(500).send({ message: err.message });
//       } else {
//         return res
//           .status(200)
//           .send({ message: `Success update data ${id}`, data: req.body });
//       }
//     }
//   );
// });
// app.patch("/Products/:id", (req, res) => {
//   //ngambil data dulu dari database berdasarkan id,
//   //kita update
//   const { title, img, price, category } = req.body;
//   const { id } = req.params;
//   db.query(`SELECT * FROM products WHERE id='${id}'`, (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: err.message });
//     } else {

//       db.query(
//         `UPDATE products SET title ='${title || result.rows[0].title}',img='${
//           img || result.rows[0].img
//         }',price='${price || result.rows[0].price}',category='${
//           category || result.rows[0].category
//         }' WHERE id = '${id}'`,
//         (err, result) => {
//           if (err) {
//             return res.status(500).send({ message: err.message });
//           } else {
//             return res
//               .status(201)
//               .send({ message: `Success update data ${id}`, data: req.body });
//           }
//         }
//       );
//     }
//   });
// });
// app.delete("/Products/:id", (req, res) => {
//   const { id } = req.params;
//   db.query(`DELETE from products WHERE id = '${id}'`, (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: err.message });
//     } else {
//       return res
//         .status(201)
//         .send({ message: `Success Delet data ${id}`, data: result });
//     }
//   });
// });

app.get("*", (req, res) => {
  return res.send({
    status: 404,
    message: "not found",
  });
});

app.listen(5000, () => {
  console.log("backend successfully running on port 5000");
});
