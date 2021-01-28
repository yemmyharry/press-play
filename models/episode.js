const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

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
    userId: mongoose.ObjectId,
    audioUrl: String
  },
  { timestamps: true }
);

const Episode = mongoose.model("Episode", episodeSchema);

async function validateEpisode(episode) {
  const schema = {
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    podcastId: Joi.objectId(),
    userId: Joi.objectId(),
    audioUrl: Joi.string().min(2).max(255).required()
  };
  const result = await schema.validateAsync(episode);

  return result;
}

exports.Episode = Episode;
exports.validate = validateEpisode;
