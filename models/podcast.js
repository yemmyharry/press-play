const Joi = require("joi");
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

const Podcast = mongoose.model("Podcast", podcastSchema);

podcastSchema.statics.lookup = function (title, userId) {
  return this.findOne({ "title": title, "userId": userId });
};

const podcastExists = async function (req) {
  const podcast = await Podcast.findOne({ "title": req.body.title, "userId": req.body.userId });
  return podcast ? true : false
}
 
function validatePodcast(podcast) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    userId: Joi.objectId().required(),
    coverImageUrl: Joi.string().min(2).max(255).required(),
  });
  const result = schema.validate(podcast);

  return result;
}

exports.Podcast = Podcast;
exports.podcastExists = podcastExists
exports.validate = validatePodcast;
