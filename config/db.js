const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect("mongodb://localhost:27017/pressPlay", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected to mongodb");
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
