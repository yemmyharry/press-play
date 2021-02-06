const mongoose = require("mongoose");
const winston = require("winston")

const db = "mongodb://localhost:27017/pressPlay"
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
      return err.message;
    });

  // mongoose
  //   .connect(process.env.MONGO_URI, {
  //     useNewUrlParser: true,
  //     useFindAndModify: false,
  //     useCreateIndex: true,
  //     useUnifiedTopology: true,
  //   })
  //   .then(() => "You are now connected to Mongo!")
  //   .catch((err) => console.error("Something went wrong", err));
};
