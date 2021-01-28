const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require("mongoose");

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
    coverImgUrl: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    authorId: mongoose.ObjectId,
  },
  { timestamps: true }
);

const Podcast = mongoose.model("Episode", podcastSchema);

async function validatePodcast(podcast) {
  const schema = {
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    authorId: Joi.objectId(),
    coverImgUrl: Joi.string().min(2).max(255).required(),
  };
  const result = await schema.validateAsync(podcast);

  return result;
}

exports.Podcast = Podcast;
exports.validate = validatePodcast;
