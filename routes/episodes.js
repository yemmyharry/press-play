const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const audioUpload = require("../middlewares/handleAudioUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const validateIfExisting = require("../middlewares/validateIfExisting");

const { validateEpisode, episodeExists } = require("../models/episode");


const {
  createEpisode,
  updateEpisode,
  getAllEpisodes,
  getEpisode,
  deleteEpisode,
} = require("../controllers/episode");

const postMiddlewares = [
  validateBody(validateEpisode),
  validateIfExisting(episodeExists, "Episode"),
];
const putMiddlewares = [validateObjectId, validateBody(validateEpisode)];

router.get("/", getAllEpisodes);

router.get("/:id", getEpisode);

router.post("/", [checkAuth, audioUpload("episodeAudio", postMiddlewares)], createEpisode);

router.put("/:id", [checkAuth, audioUpload("episodeAudio", putMiddlewares)], updateEpisode);

router.delete("/:id", checkAuth, deleteEpisode);

module.exports = router;
