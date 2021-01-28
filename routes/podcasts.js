const express = require("express");
const handleUploads = require("../middlewares/handleUploads");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");

const router = express.Router();
const { validate, Podcast } = require("../models/podcast");

router.get("/", async (req, res) => {
  let podcasts = await Podcast.find();
  res.send(podcasts);
});

router.get("/:id", validateObjectId, async (req, res) => {
  let podcast = await Podcast.findById(req.params.id);
  if (!podcast) return res.status(404).send({
    status: false, message: "Invalid Podcast", data: null
  })
  res.send(podcast);
});

router.post("/", [handleUploads("coverImage")], async (req, res) => {
  const podcastInDB = await Podcast.findOne({
    title: req.body.title,
    userId: req.body.userId,
  });
  if (podcastInDB)
    return res.status(400).send({
      status: false,
      message: "Podcast already exists",
      data: null,
    });

  let podcast = new Podcast(req.body);
  podcast = await podcast.save();
  res.send({ status: true, message: null, data: podcast });
});

module.exports = router;
