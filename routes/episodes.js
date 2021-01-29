const express = require("express");
const audioUpload = require("../middlewares/handleAudioUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");

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

router.post("/", [audioUpload("episodeAudio")], createEpisode);

router.put("/:id", [audioUpload("episodeAudio")], updateEpisode);

router.delete("/:id", deleteEpisode);

module.exports = router;
