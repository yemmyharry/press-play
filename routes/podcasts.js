const express = require("express");
const coverImageUpload = require("../middlewares/handleCoverImageUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const validateIfExisting = require("../middlewares/validateIfExisting");
const { podcastExists, validatePodcast } = require("../models/podcast");
const router = express.Router();

const postMiddlewares = [
  validateBody(validatePodcast),
  validateIfExisting(podcastExists, "Podcast"),
];

const putMiddlewares = [validateObjectId, validateBody(validatePodcast)];

const {
  createPodcast,
  updatePodcast,
  getAllPodcastsWithEpisodes,
  getEpisodesForPodcast,
  getPodcast,
  deletePodcast,
  searchPodcasts
} = require("../controllers/podcast");

router.get("/", getAllPodcastsWithEpisodes);

router.get("/search/:title", searchPodcasts);

router.get("/:id", validateObjectId, getPodcast);

router.get("/:id/episodes", getEpisodesForPodcast);

router.post(
  "/",
  [coverImageUpload("coverImage", postMiddlewares)],
  createPodcast
);

router.put(
  "/:id",
  [coverImageUpload("coverImage", putMiddlewares)],
  updatePodcast
);

router.delete("/:id", validateObjectId, deletePodcast);

module.exports = router;
