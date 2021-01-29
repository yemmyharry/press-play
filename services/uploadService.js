const multer = require("multer");

let storage = multer.diskStorage({ dest: "uploads" });

const upload = multer({ storage });

module.exports = upload;
