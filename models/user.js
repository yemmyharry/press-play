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
      required: true,
      match: /^\S+@\S+\.\S+$/,
    }, 
    password: { type: String, required: true, minlength: 7 },
 
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
  
 
function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(2).max(1024).required(),
    userId: Joi.objectId().required(),
    coverImageUrl: Joi.string().min(2).max(255).required(),
  });
  const result = schema.validate(user);

  return result;
}

exports.User = User;
 
