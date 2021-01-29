const express = require("express");
const coverImageUpload = require("../middlewares/handleCoverImageUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");

const router = express.Router();
const {
  createPodcast,
  updatePodcast,
  getAllPodcasts,
  getEpisodesForPodcast,
  getPodcast,
  deletePodcast,
} = require("../controllers/podcast");

router.get("/", getAllPodcasts);

router.get("/:id", validateObjectId, getPodcast);

router.get("/:id/episodes", getEpisodesForPodcast);

router.post("/", [coverImageUpload("coverImage")], createPodcast);

router.put(
  "/:id",
  validateObjectId,
  [coverImageUpload("coverImage")],
  updatePodcast
);

router.delete("/:id", validateObjectId, deletePodcast);

module.exports = router;
