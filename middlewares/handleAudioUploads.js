const upload = require("../services/uploadService");
const { audioUpload } = require("../utils/cloudinary");
const _ = require("lodash");
const { validateEpisode, episodeExists } = require("../models/episode");
const validateBody = require("./validateBody");
const validateIfExisting = require("./validateIfExisting");


async function uploadEpisodeAudio(req, res, next) {
  if (!req.file) return res.status(400).send({
    status: false, message: "episodeAudio is Required", data: null
  });
  
  await audioUpload(req);

  next();
}

module.exports = (field) => {
  return [
    upload.single(field), validateBody(validateEpisode), 
    validateIfExisting(episodeExists, "Episode"), uploadEpisodeAudio
  ];
};
