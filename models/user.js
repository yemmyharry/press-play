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
      required: true,
      match: /^\S+@\S+\.\S+$/,
    },
<<<<<<< HEAD
    password: { type: String, required: true},
=======
    password: { type: String, required: true, minlength: 7 },
>>>>>>> features-podcastRoute
    resetLink: {
      data: String,
      default: "",
    },
    isAuthor: { type: Boolean, default: false },
    bio: { type: String, maxlength: 255, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
  

exports.User = User;