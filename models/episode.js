const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
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
    podcastId: mongoose.ObjectId,
    episodeAudioUrl: { type: String, required: true },
  },
  { timestamps: true }
);

episodeSchema.statics.lookup = function (title, userId) {
  return this.findOne({ title: title, userId: userId });
};

const episodeExists = async function (req) {
  const episode = await Episode.findOne({
    title: req.body.title,
    userId: req.body.userId,
  });
  return episode ? true : false;
};

const Episode = mongoose.model("Episode", episodeSchema);

function validateEpisode(episode) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    podcastId: Joi.objectId(),
  });
  const result = schema.validate(episode);

  return result;
}

exports.Episode = Episode;
exports.validateEpisode = validateEpisode;
exports.episodeExists = episodeExists;
