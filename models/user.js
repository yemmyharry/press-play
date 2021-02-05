const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },

    resetLink: {
      data: String,
      default: "",
    },
    isAuthor: { type: Boolean, default: false },
    bio: { type: String, maxlength: 255, default: "" },
    subscribedPodcasts: {
      type: Array,
      default: [],
    },
    likedPodcasts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.statics.isSubscribed = function (podcastId) {
  return this.findOne({ subscribedPodcasts: { $in: [podcastId] } });
};

userSchema.statics.subscribeToPodcast = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    userId,
    { $push: { subscribedPodcasts: podcastId } },
    { new: true }
  );
};

userSchema.statics.unsubscribeFromPodcast = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    userId,
    { $pull: { subscribedPodcasts: podcastId } },
    { new: true }
  );
};

userSchema.statics.hasLikedPodcast = function (podcastId) {
  return this.findOne({ likedPodcasts: { $in: [podcastId] } });
};

userSchema.statics.likePodcast = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    userId,
    { $push: { likedPodcasts: podcastId } },
    { new: true }
  );
};

userSchema.statics.unlikePodcast = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    userId,
    { $pull: { likedPodcasts: podcastId } },
    { new: true }
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(req) {
  let user = req.body;
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(8).max(255).required(),
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
  });

  if (req.method === "PUT" || req.method === "PATCH") {
    schema = Joi.object({
      email: Joi.string().min(5).max(255).email(),
      password: Joi.string().min(8).max(255),
      firstName: Joi.string().min(2).max(255),
      lastName: Joi.string().min(2).max(255),
    });
  }
  const result = schema.validate(user);

  return result;
}

function validateLogin(req) {
  let user = req.body;
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required(),
  });
  const result = schema.validate(user);

  return result;
}

exports.User = User;

exports.validateUser = validateUser;

exports.validateLogin = validateLogin;
