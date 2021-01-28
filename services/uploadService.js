const multer = require("multer");
const shortid = require("shortid");

var storage = multer.diskStorage({ destination: "uploads" });

const upload = multer({ storage });

module.exports = upload;
