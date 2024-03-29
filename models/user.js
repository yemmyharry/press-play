const Joi = require("joi");
const mongoose = require("mongoose");
const { formattedDate } = require("../utils/helpers");
const { Episode } = require("./episode");
const bcrypt = require("bcrypt");

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
    likedEpisodes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.statics.isSubscribed = function (userId, podcastId) {
  return this.findOne({
    _id: userId,
    subscribedPodcasts: { $in: [podcastId] },
  });
};

userSchema.statics.subscribeToPodcast = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    { _id: userId },
    { $push: { subscribedPodcasts: podcastId } },
    { new: true }
  );
};

userSchema.statics.unsubscribeFromPodcast = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    { _id: userId },
    { $pull: { subscribedPodcasts: podcastId } },
    { new: true }
  );
};

userSchema.statics.haslikedEpisode = function (userId, podcastId) {
  return this.findOne({ _id: userId, likedEpisodes: { $in: [podcastId] } });
};

userSchema.statics.getLikedEpisodes = async function (userId) {
  const user = await this.findById(userId);
  if (!user) return { status: false, message: "Invalid User" };
  const episodeIds = user.likedEpisodes;
  let episodes = [];
  for (let episodeId of episodeIds) {
    const episode = await Episode.findById(episodeId)
      .select("-__v -cloudinary")
      .lean();

    episode.date = formattedDate(episode.createdAt);

    episodes.push(episode);
  }

  return episodes;
};

userSchema.statics.getSubscriptions = async function (Podcast, userId) {
  const user = await this.findById(userId);
  const podcastIds = user.subscribedPodcasts;
  let podcasts = [];
  for (let podcastId of podcastIds) {
    const podcast = await Podcast.findById(podcastId)
      .select("-__v -cloudinary")
      .lean();
    if (!podcast) continue;

    podcast.date = formattedDate(podcast.createdAt);

    podcasts.push(podcast);
  }

  return podcasts;
};

userSchema.statics.likeEpisode = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    { _id: userId },
    { $push: { likedEpisodes: podcastId } },
    { new: true }
  );
};

userSchema.statics.unlikeEpisode = function (userId, podcastId) {
  return this.findByIdAndUpdate(
    { _id: userId },
    { $pull: { likedEpisodes: podcastId } },
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

userSchema.pre("findOneAndUpdate", async function (next) {
  const data = this || this.update;
  if (data.password !== "" && data.password !== undefined) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(data.password, salt);
    data.password = hashed;
  }
  next();
});

exports.User = User;

exports.validateUser = validateUser;

exports.validateLogin = validateLogin;
