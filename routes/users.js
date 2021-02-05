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
  unSubscribeFromPodcast,
  updateUser,
} = require("../controllers/user");

const checkAuth = require("../middlewares/checkAuth");

const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validateUser, validateLogin } = require("../models/user");

router.get("/me", checkAuth, getLoggedInUser);

router.get("/:id/podcasts", [checkAuth, validateObjectId], getAllPodcastData);

router.post("/signup", validateBody(validateUser), userSignup);

router.post("/subscribe/:id", [checkAuth, validateObjectId], subscribeToPodcast);

router.post("/unsubscribe/:id", [checkAuth, validateObjectId], unSubscribeFromPodcast);

router.get("/activate-account", activateAccount);

router.post("/login", validateBody(validateLogin), userLogin);

router.put("/forgot-password", forgotPassword);

router.put("/reset-password", resetPassword);

router.put("/:id", validateObjectId, updateUser);

router.delete("/:id", validateObjectId, deleteUser);

module.exports = router;
