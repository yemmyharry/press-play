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

const validateBody = require("../middlewares/validateBody");
const { validateUser, validateLogin } = require("../models/user");


router.post("/signup", validateBody(validateUser) , userSignup);

router.post("/login", validateBody(validateLogin), userLogin);

router.get("/activate-account", activateAccount);

router.put("/forgot-password", forgotPassword);

router.put("/reset-password", resetPassword);

router.get("/me", getUserFromToken)

module.exports = router;
