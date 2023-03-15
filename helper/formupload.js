const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/images");
  },
  filename: function (req, file, cb) {
    // let filename = file.originalname.split(".");
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});

const formUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let formatType = path.extname(file.originalname);
    if (formatType == ".png" || formatType == ".jpg" || formatType == ".jpeg") {
      cb(null, true);
    } else {
      cb("Image not valid", false);
    }
  },
  limits: {
    fileSize: 1048576 * 3, // 3mb
  },
});

// fs.unlink('path/file.', (err) => {
//   if (err) throw err;
//   console.log('path/file.txt was deleted');
// });

module.exports = formUpload;
