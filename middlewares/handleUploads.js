const upload = require("../services/uploadService");
const { coverImageUpload } = require("../utils/cloudinary");
const _ = require("lodash");
const validateBody = require("../middlewares/validateBody");
const { validate, podcastExists } = require("../models/podcast");
const validateIfExisting = require("./validateIfExisting");

async function uploadFile(req, res, next) {
  if (!req.file) return res.status(400).send({
    status: false, message: "coverImage is Required", data: null
  });
  await coverImageUpload(req);

  next();
}

module.exports = (field) => {
  return [upload.single(field), validateIfExisting(podcastExists, "Podcast"), uploadFile, validateBody(validate)];
};
