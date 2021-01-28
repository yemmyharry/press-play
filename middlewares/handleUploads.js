const upload = require("../services/uploadService");
const { coverImageUpload } = require("../utils/cloudinary");
const _ = require("lodash");
const validateBody = require("../middlewares/validateBody");
const { validate } = require("../models/podcast");

async function uploadFile(req, res, next) {
  if (!req.file) return res.status(400).send({
    status: false, message: "coverImage is Required", data: null
  });
  await coverImageUpload(req);

  next();
}

module.exports = (field) => {
  return [upload.single(field), uploadFile, validateBody(validate)];
};
