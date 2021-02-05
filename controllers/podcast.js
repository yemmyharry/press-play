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
  const podCastInDb = await Podcast.findById(req.params.id);
  if (req.file && req.file.fieldname === "coverImage") {
    deleteOldFile = await deleteFile(podCastInDb.cloudinary.public_id, "image");

    upload = await coverImageUpload(req);
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

exports.getAllPodcastsWithEpisodes = async (req, res) => {
  let podcasts = await Podcast.getAllPodcastsWithEpisodes();
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

exports.searchPodcasts = async (req, res) => {
  let podcasts = await Podcast.search(req.params.title);
  res.send(podcasts);
};


exports.deletePodcast = async (req, res) => {
  const podcast = await Podcast.findByIdAndDelete(req.params.id);
  if (!podcast)
    return res.send({ status: false, message: "Invalid Podcast", data: null });

  deleteOldFile = await deleteFile(podcast.cloudinary.public_id, "image");

  res.send({ status: true, message: null, data: podcast });
};
