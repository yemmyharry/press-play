const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Podcast } = require("../models/podcast");
const { Episode } = require("../models/episode");
const { updateObject } = require("../utils/helpers");
const { coverImageUpload, deleteFile } = require("../utils/cloudinary");

exports.createPodcast = async (req, res) => {
  const upload = await coverImageUpload(req);
  if (!upload)
    return res.send({
      status: false,
      message: "Upload error, please try again",
      data: null,
    });
  let podcast = new Podcast(req.body);
  podcast = await podcast.save();
  res.send({ status: true, message: null, data: podcast });
};

exports.updatePodcast = async (req, res) => {
  if (req.file && req.file.fieldname === "coverImage") {
    deleteOldFile = await deleteFile(req, podcastInDb.cloudinary.public_id);

    upload = coverImageUpload();
  }

  let podcast = await Podcast.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!podcast)
    return res
      .status(404)
      .send({ status: false, message: "Invalid Podcast", data: null });
      
  res.send({ status: true, message: null, data: podcast });
};

exports.getAllPodcasts = async (req, res) => {
  let podcasts = await Podcast.getAllPodcasts();
  res.send(podcasts);
};

exports.getEpisodesForPodcast = async (req, res) => {
  const podcastId = req.params.id;
  let episodes = await Episode.find({ podcastId });
  res.send(episodes);
};

exports.getPodcast = async (req, res) => {
  let podcast = await Podcast.getOnePodcast(req.params.id);
  if (!podcast)
    return res.status(404).send({
      status: false,
      message: "Invalid Podcast",
      data: null,
    });
  res.send(podcast);
};

exports.deletePodcast = async (req, res) => {
  const podcast = await Podcast.findByIdAndDelete(req.params.id);
  if (!podcast)
    return res.send({ status: false, message: "Invalid Podcast", data: null });
  res.send({ status: true, message: null, data: podcast });
};
