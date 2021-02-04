const upload = require("../services/uploadService");
const _ = require("lodash");

module.exports = (field, middlewares) => {

  return [
    upload.single(field), [...middlewares]
  ];
};
