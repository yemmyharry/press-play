const express = require("express");
const _ = require("lodash");

const router = express.Router();
const { validateEpisode, Episode } = require("../models/episode");

exports.createEpisode = async (req, res) => {
  let episode = new Episode(req.body);
  episode = await episode.save();
  res.send({ status: true, message: null, data: episode });
};

exports.updateEpisode = async (req, res) => {
  let episode = await Episode.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["title", "description", "episodeAudioUrl", "podcastId"]),
    { new: true }
  );

  if (!episode)
    return res
      .status(404)
      .send({ status: false, message: "Invalid Episode", data: null });
  res.send({ status: true, message: null, data: episode });
};

exports.getAllEpisodes = async (req, res) => {
  let episodes = await Episode.find();
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
  res.send({ status: true, message: null, data: episode });
}