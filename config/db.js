const mongoose = require("mongoose");
const winston = require("winston")

const db = process.env.MONGO_URI
module.exports = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info(`Connected to ${db}`);
    })
    .catch((err) => {
      return winston.error(err.message);
    });

};
