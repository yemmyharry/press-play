const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    bio: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1024,
    },
    userId: mongoose.ObjectId,
  },
  { timestamps: true }
);

const Author = mongoose.model("Episode", authorSchema);

async function validateAuthor(author) {
  const schema = {
    name: Joi.string().min(2).max(255).required(),
    bio: Joi.string().min(2).max(255).required(),
    userId: Joi.objectId(),
  };
  const result = await schema.validateAsync(author);

  return result;
}

exports.Author = Author;
exports.validate = validateAuthor;
