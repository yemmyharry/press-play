const Joi = require("joi");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const _ = require("lodash");
const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1024,
    },
    coverImageUrl: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    userId: mongoose.ObjectId,
  },
  { timestamps: true }
);

podcastSchema.statics.lookup = function (title, userId) {
  return this.findOne({ title: title, userId: userId });
};

podcastSchema.statics.getOnePodcast = async function (podcastId) {
  let podcast = await this.findById(podcastId).lean();
  let authorId = podcast.authorId || podcast.userId;
  const author = await User.findById(authorId).select("firstName lastName bio");
  podcast.author = author;

  return podcast;
};

const Podcast = mongoose.model("Podcast", podcastSchema);

const podcastExists = async function (req) {
  const podcast = await Podcast.findOne({
    title: req.body.title,
    userId: req.body.userId,
  });
  return podcast ? true : false;
};

function validatePodcast(podcast) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    episodeAudio: Joi.any(),
    userId: Joi.objectId().required(),
  });
  const result = schema.validate(podcast);

  return result;
}

exports.Podcast = Podcast;
exports.podcastExists = podcastExists;
exports.validatePodcast = validatePodcast;
