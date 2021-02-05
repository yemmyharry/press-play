const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const coverImageUpload = require("../middlewares/handleCoverImageUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const validateIfExisting = require("../middlewares/validateIfExisting");

const { podcastExists, validatePodcast } = require("../models/podcast");

const {
  createPodcast,
  updatePodcast,
  getAllPodcastsWithEpisodes,
  getEpisodesForPodcast,
  getPodcast,
  deletePodcast,
  searchPodcasts,
} = require("../controllers/podcast");

const postMiddlewares = [
  validateBody(validatePodcast),
  validateIfExisting(podcastExists, "Podcast"),
];

const putMiddlewares = [validateObjectId, validateBody(validatePodcast)];

router.get("/", getAllPodcastsWithEpisodes);

router.get("/search/:title", searchPodcasts);

router.get("/:id", validateObjectId, getPodcast);

router.get("/:id/episodes", getEpisodesForPodcast);

router.post(
  "/",
  [checkAuth, coverImageUpload("coverImage", postMiddlewares)],
  createPodcast
);

router.put(
  "/:id",
  [checkAuth, coverImageUpload("coverImage", putMiddlewares)],
  updatePodcast
);

router.delete("/:id", [checkAuth, validateObjectId], deletePodcast);

module.exports = router;
