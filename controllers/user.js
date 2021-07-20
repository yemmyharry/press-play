const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Podcast } = require("../models/podcast");
const { Episode } = require("../models/episode");
const _ = require("lodash");
const { sendPasswordResetMail, sendActivationMail } = require("../config/mail");

const { SECRET, RESET_PASSWORD_KEY, ACCOUNT_ACTIVATE } = process.env;

exports.userSignup = async (req, res) => {
  const origin = req.headers.origin;

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser)
    return res
      .status(400)
      .send({ status: false, message: "This user already exists" });

  const token = jwt.sign({ ...req.body }, ACCOUNT_ACTIVATE, {
    expiresIn: "1h",
  });
  const user = { ...req.body, token, origin };

  await sendActivationMail(user);

  res.status(200).send({
    status: true,
    message: "Email verification mail sent successfully.",
    data: null,
  });
};

exports.getLoggedInUser = async (req, res, next) => {
  const user = await User.findById(req.user.userId).select("-__v -password");
  if (!user)
    return res.status(400).send({
      status: false,
      message: "Invalid User",
      data: null,
    });

  res.send({
    status: true,
    message: null,
    data: user,
  });
};

exports.subscribeToPodcast = async (req, res) => {
  const podcastId = req.params.id;
  const isSubscribed = await User.isSubscribed(req.user.userId, podcastId);
  if (isSubscribed)
    return res.send({
      status: false,
      message: "User is already subscribed",
      data: null,
    });

  const podcastInDB = await Podcast.findByIdAndUpdate(podcastId, {
    $inc: { subscriptionsCount: +1 },
  });
  if (!podcastInDB)
    return res.send({ status: false, message: "Invalid Podcast", data: null });

  const user = await User.subscribeToPodcast(req.user.userId, podcastId);

  res.send({ status: true, message: null, data: user });
};

exports.unsubscribeFromPodcast = async (req, res) => {
  const podcastId = req.params.id;
  const isSubscribed = await User.isSubscribed(req.user.userId, podcastId);
  if (!isSubscribed)
    return res.send({
      status: false,
      message: "User is not subscribed to this podcast",
      data: null,
    });
  const podcastInDB = await Podcast.findOneAndUpdate(
    { _id: podcastId, subscriptionsCount: { $gt: 0 } },
    {
      $inc: { subscriptionsCount: -1 },
    }
  );

  if (!podcastInDB)
    return res.send({ status: false, message: "Invalid Episode", data: null });

  const user = await User.unsubscribeFromPodcast(req.user.userId, podcastId);

  res.send({ status: true, message: null, data: user });
};

exports.getLikedEpisodes = async (req, res) => {
  const likedEpisodes = await User.getLikedEpisodes(req.user.userId);
  if (likedEpisodes.message)
    return res.send({
      status: false,
      message: likedEpisodes.message,
      data: null,
    });
  res.send({ status: true, message: null, data: likedEpisodes });
};

exports.getSubscriptions = async (req, res) => {
  const subscriptions = await User.getSubscriptions(Podcast, req.user.userId);

  res.send({ status: true, message: null, data: subscriptions });
};

exports.likeEpisode = async (req, res) => {
  const episodeId = req.params.id;
  const haslikedEpisode = await User.haslikedEpisode(
    req.user.userId,
    episodeId
  );
  if (haslikedEpisode)
    return res.send({
      status: false,
      message: "User has already liked this Episode",
      data: null,
    });
  const episodeInDB = await Episode.findByIdAndUpdate(episodeId, {
    $inc: { likesCount: +1 },
  });

  if (!episodeInDB)
    return res.send({ status: false, message: "Invalid Episode", data: null });

  const user = await User.likeEpisode(req.user.userId, episodeId);

  res.send({ status: true, message: null, data: user });
};

exports.unlikeEpisode = async (req, res) => {
  const episodeId = req.params.id;
  const haslikedEpisode = await User.haslikedEpisode(
    req.user.userId,
    episodeId
  );
  if (!haslikedEpisode)
    return res.send({
      status: false,
      message: "User has not liked this Episode",
      data: null,
    });

  const user = await User.unlikeEpisode(req.user.userId, episodeId);

  await Episode.findOneAndUpdate(
    { _id: episodeId, likesCount: { $gt: 0 } },
    {
      $inc: { likesCount: -1 },
    }
  );

  res.send({ status: true, message: null, data: user });
};

exports.getAllPodcastData = async (req, res) => {
  const podcastData = await Podcast.getAllPodcastData(req.user.userId);
  res.send({ status: true, message: null, data: podcastData });
};

exports.userLogin = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).send({
        status: false,
        message: "User does not exist",
        data: null,
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (!result) {
        return res.status(404).send({
          status: false,
          message: "Invalid Password",
          data: null,
        });
      }
      if (result) {
        const token = jwt.sign({ userId: user._id }, SECRET, {
          expiresIn: "1 day",
        });
        return res.status(200).send({
          status: true,
          message: "Authentication/Login successful",
          data: { token },
        });
      }
    });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.query;
  if (token) {
    jwt.verify(token, ACCOUNT_ACTIVATE, (err, decodedToken) => {
      if (err) {
        return res.status(404).send("Incorrect or expired link");
      }
      const { firstName, lastName, email, password } = decodedToken;

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(400).json({
            status: false,
            message: "This user already exists",
            data: null,
          });
        }

        bcrypt.hash(password, 10, (err, hash) => {
          let newUser = new User({
            firstName,
            lastName,
            email,
            password: hash,
          });
          newUser.save((err, success) => {
            if (err) {
              console.log("error in signup");
              return res
                .status(400)
                .json({ status: false, message: err, data: null });
            }
            res.status(200).json({
              status: true,
              message: "signup success",
              data: {
                user: _.pick(newUser, [
                  "_id",
                  "firstName",
                  "lastName",
                  "email",
                ]),
                token,
              },
            });
          });
        });
      });
    });
  } else {
    return res.send({
      status: false,
      message: "No token provided",
      data: null,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (!user)
    return res.send({
      status: true,
      message: "Email sent successfully",
      data: null,
    });

  const token = jwt.sign({ _id: user._id }, RESET_PASSWORD_KEY, {
    expiresIn: "1h",
  });

  user = await User.findByIdAndUpdate(user._id, { resetLink: token });
  sendPasswordResetMail(user);

  res.status(200).send({
    message: "Email was sent successfully.",
    status: true,
  });
};

exports.resetPassword = (req, res) => {
  const { resetLink, newPassword } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, RESET_PASSWORD_KEY, (err, decodedData) => {
      if (err) {
        return res.status(401).send({
          status: false,
          message: "Incorrect or expired token",
          data: null,
        });
      }
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          res.status(400).send({
            status: false,
            message: "User with this token does not exist",
            data: null,
          });
        }
        bcrypt.hash(newPassword, 10, (err, hashReset) => {
          const obj = {
            password: hashReset,
            resetLink: "",
          };
          user = _.extend(user, obj);
          //user is destination while obj is source

          user.save((err, result) => {
            if (err) {
              return res.status(400).send({
                status: false,
                message: "Reset password error",
                data: null,
              });
            } else {
              return res.json({
                status: true,
                message: "Your password has been successfully changed.",
                data: null,
              });
            }
          });
        });
      });
    });
  } else {
    res.status(401).send({
      status: true,
      message: "Authentication Error",
      data: null,
    });
  }
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user)
    return res.send({ status: false, message: "Invalid User", data: null });
  res.send({ status: true, message: null, data: user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return res.send({ status: false, message: "Invalid User", data: null });
  res.send({ status: true, message: null, data: user });
};
