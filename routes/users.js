const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  activateAccount,
  getLoggedInUser,
  deleteUser
} = require("../controllers/user");

const checkAuth = require("../middlewares/checkAuth");

const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validateUser, validateLogin } = require("../models/user");


router.get("/me", checkAuth, getLoggedInUser)

router.post("/signup", validateBody(validateUser) , userSignup);

router.get("/activate-account", activateAccount);


router.post("/login", validateBody(validateLogin), userLogin);


router.put("/forgot-password", forgotPassword);

router.put("/reset-password", resetPassword);

router.delete("/:id", validateObjectId, deleteUser)
module.exports = router;
