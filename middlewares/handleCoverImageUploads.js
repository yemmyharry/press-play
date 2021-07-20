const upload = require("../services/uploadService");

module.exports = (field, middlewares) => {
  return [upload.single(field), [...middlewares]];
};
