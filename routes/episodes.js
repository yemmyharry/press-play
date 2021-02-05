const express = require("express");
const audioUpload = require("../middlewares/handleAudioUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const validateIfExisting = require("../middlewares/validateIfExisting");
const { validateEpisode, episodeExists } = require("../models/episode");

const postMiddlewares = [
  validateBody(validateEpisode),
  validateIfExisting(episodeExists, "Episode"),
];
const putMiddlewares = [validateObjectId, validateBody(validateEpisode),];
const router = express.Router();

const {
  createEpisode,
  updateEpisode,
  getAllEpisodes,
  getEpisode,
  deleteEpisode,
} = require("../controllers/episode");

router.get("/", getAllEpisodes);

router.get("/:id", getEpisode);

router.post("/", [audioUpload("episodeAudio", postMiddlewares)], createEpisode);

router.put(
  "/:id",
  [audioUpload("episodeAudio", putMiddlewares)],
  updateEpisode
);

router.delete("/:id", deleteEpisode);

module.exports = router;
