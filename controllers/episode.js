const express = require("express");
const _ = require("lodash");

const router = express.Router();
const { Episode } = require("../models/episode");
const { audioUpload, deleteFile } = require("../utils/cloudinary");

exports.createEpisode = async (req, res) => {
  const upload = await audioUpload(req);
  if (!upload)
    return res.send({
      status: false,
      message: "Upload error, please try again",
      data: null,
    });
  let episode = new Episode(req.body);
  episode = await episode.save();
  res.send({ status: true, message: null, data: episode });
};

exports.updateEpisode = async (req, res) => {
  const episodeInDb = await Episode.findById(req.params.id);
  if (req.file && req.file.fieldname === "episodeAudio") {
    deleteOldFile = await deleteFile(episodeInDb.cloudinary.public_id, "video");

    upload = await audioUpload(req);
  }

  let episode = await Episode.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!episode)
    return res
      .status(404)
      .send({ status: false, message: "Invalid Episode", data: null });

  res.send({ status: true, message: null, data: episode });
};

exports.getAllEpisodes = async (req, res) => {
  let episodes = await Episode.find().select("-__v -cloudinary");
  res.send(episodes);
};

exports.getEpisode = async (req, res) => {
  let episode = await Episode.findById(req.params.id);
  if (!episode)
    return res.status(404).send({
      status: false,
      message: "Invalid Episode",
      data: null,
    });
  res.send(episode);
};

exports.deleteEpisode = async (req, res) => {
  const episode = await Episode.findByIdAndDelete(req.params.id);
  if (!episode)
    return res.send({ status: false, message: "Invalid Episode", data: null });

  deleteOldFile = await deleteFile(episode.cloudinary.public_id, "video");

  res.send({ status: true, message: null, data: episode });
};
