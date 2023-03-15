const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "doxeoixv4",
  api_key: "767492325776934",
  api_secret: "86ptmZPzv0V-Wq-HRP_7w6d1N5I",
});

module.exports = cloudinary;
