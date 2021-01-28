const multer = require("multer")
const shortid = require("shortid")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log()
    cb(null, 'uploads')
  },
  
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split(".").pop();
    let filename = `${shortid.generate()}_${Date.now()}.${fileExt}`;
    cb(null, filename);
  }
})
 
const upload = multer({ storage })

module.exports = upload