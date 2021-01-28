const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true, minlength: 7 },
  resetLink: {
    data: String,
    default: "",
  },
  isAuthor: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
