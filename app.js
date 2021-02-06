require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const error = require("./middlewares/error");
require("./config/joiObjectId")();
require("./config/logging")();

/* Routes */
const usersRouter = require("./routes/users");
const podcastsRouter = require("./routes/podcasts");
const episodesRouter = require("./routes/episodes");

/* Database connections */
// mongoose
//   .connect("mongodb://localhost:27017/pressPlay", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log("Connected to mongodb");
//   })
//   .catch((err) => {
//     return err.message;
//   });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => "You are now connected to Mongo!")
  .catch((err) => console.error("Something went wrong", err));

//middlewares
app.use(express.json());

//to prevent cors errors
app.use(cors());

app.get("/", (req, res, next) => {
  res.send(`Welcome to Press Play API`);
});

app.use("/api/users", usersRouter);

app.use("/api/podcasts", podcastsRouter);

app.use("/api/episodes", episodesRouter);

app.use("*", (req, res) => {
  res.send({ status: false, message: "This is an invalid route", data: null });
});

app.use(error);

app.listen(process.env.PORT || 4000, () => {
  console.log("app listening at port 4000");
});
