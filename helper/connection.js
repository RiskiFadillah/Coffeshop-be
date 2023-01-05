const { Client } = require("pg");
require("dotenv").config();

// {process.env.DB_USER,process.env.DB_USER}
// console.log(process.env.DB_HOST)


const db = new Client({
  // user: process.env.DB_USER || 'postgres',
  // host: process.env.DB_HOST || "localhost",
  // database: process.env.DB_DATABASE || "coffeshop",
  // password: process.env.DB_PASSWORD || "12345",
  // port:  process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect((err) => {
  if (err) {
    console.log("db connection error", err);
  }
  // if (!err) {
  //   console.log("database berhasil tersambung");
  // } else {
  //   console.log("db error connection", err);
  // }
});

module.exports = db;
