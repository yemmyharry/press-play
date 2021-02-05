const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  activateAccount,
  getLoggedInUser,
  deleteUser,
  getAllPodcastData,
  subscribeToPodcast,
  unsubscribeFromPodcast,
  updateUser,
  likeEpisode,
  unlikeEpisode,
  getLikedEpisodes,
  getSubscriptions,
} = require("../controllers/user");

const checkAuth = require("../middlewares/checkAuth");

const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validateUser, validateLogin } = require("../models/user");

router.get("/me", checkAuth, getLoggedInUser);

router.get("/podcasts", checkAuth, getAllPodcastData);

router.post("/signup", validateBody(validateUser), userSignup);

router.get("/subscriptions", checkAuth, getSubscriptions);

router.post(
  "/subscribe/:id",
  [checkAuth, validateObjectId],
  subscribeToPodcast
);

router.put(
  "/unsubscribe/:id",
  [checkAuth, validateObjectId],
  unsubscribeFromPodcast
);

router.get("/likes", checkAuth, getLikedEpisodes);

router.post("/like/:id", [checkAuth, validateObjectId], likeEpisode);

router.put("/unlike/:id", [checkAuth, validateObjectId], unlikeEpisode);

router.get("/activate-account", activateAccount);

router.post("/login", validateBody(validateLogin), userLogin);

router.put("/forgot-password", forgotPassword);

router.put("/reset-password", resetPassword);

router.put("/:id", validateObjectId, updateUser);

router.delete("/:id", validateObjectId, deleteUser);

module.exports = router;
