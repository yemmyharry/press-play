const Joi = require("joi");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const _ = require("lodash");
const { formattedDate } = require("../utils/helpers");
const { Episode } = require("./episode");
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
    episodeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    subscriptionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    cloudinary: {
      type: Object,
    },
  },
  { timestamps: true }
);

podcastSchema.statics.lookup = function (title, userId) {
  return this.findOne({ title, userId: userId });
};

podcastSchema.statics.getAllPodcastData = async function (userId) {
  let podcasts = [];
  for await (let podcast of this.find({ userId })
    .select("-__v -cloudinary")
    .lean()) {
    const episodes = await Episode.find({ podcastId: podcast._id }).select(
      "-cloudinary"
    );
    podcast.episodes = episodes;
    podcasts.push(podcast);
  }
  return podcasts;
};

podcastSchema.statics.search = function (title) {
  return this.find({ title: { $regex: title, $options: "i" }, episodeCount: { $gt: 0 } });
};

podcastSchema.statics.getOnePodcast = async function (podcastId) {
  let podcast = await this.findById(podcastId).lean();
  const author = await User.findById(podcast.userId).select(
    "firstName lastName bio"
  );

  podcast.author = author;
  podcast.date = formattedDate(podcast.createdAt);

  return podcast;
};

podcastSchema.statics.getAllPodcastsWithEpisodes = async function () {
  let podcasts = [];
  for await (let podcast of this.find({ episodeCount: { $gt: 0 } }).lean()) {
    const author = await User.findById(podcast.userId).select(
      "firstName lastName bio"
    );

    podcast.author = author;
    podcast.date = formattedDate(podcast.createdAt);

    podcasts.push(podcast);
  }

  return podcasts;
};

const Podcast = mongoose.model("Podcast", podcastSchema);

const podcastExists = async function (req) {
  const podcast = await Podcast.findOne({
    title: req.body.title,
    userId: req.body.userId,
  });
  return podcast ? true : false;
};

function validatePodcast(req) {
  let podcast = req.body;
  let schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    coverImage: Joi.any(),
    userId: Joi.objectId().required(),
  });

  if (req.method === "PUT" || req.method === "PATCH") {
    schema = Joi.object({
      title: Joi.string().min(2).max(255),
      description: Joi.string().min(2).max(1024),
      coverImage: Joi.any(),
      coverImageUrl: Joi.string(),
      userId: Joi.objectId(),
    });
  }

  const result = schema.validate(podcast);

  return result;
}

exports.Podcast = Podcast;
exports.podcastExists = podcastExists;
exports.validatePodcast = validatePodcast;
