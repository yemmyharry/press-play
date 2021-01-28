const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  activateAccount,
  getUserFromToken
} = require("../controllers/user");

router.post("/signup", userSignup);

router.post("/activate-account", activateAccount);

router.put("/forgot-password", forgotPassword);

router.put("/reset-password", resetPassword);

router.post("/login", userLogin);

router.get("/me", getUserFromToken)

module.exports = router;
