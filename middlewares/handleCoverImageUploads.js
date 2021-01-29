const upload = require("../services/uploadService");
const { coverImageUpload } = require("../utils/cloudinary");
const _ = require("lodash");
const { validatePodcast, podcastExists } = require("../models/podcast");
const validateBody = require("../middlewares/validateBody");
const validateIfExisting = require("./validateIfExisting");

async function uploadCoverImage(req, res, next) {
  if (!req.file) return res.status(400).send({
    status: false, message: "coverImage is Required", data: null
  });
  
  await coverImageUpload(req);

  next();
}

module.exports = (field) => {
  return [
    upload.single(field), validateBody(validatePodcast), 
    validateIfExisting(podcastExists, "Podcast"), uploadCoverImage
  ];
};
