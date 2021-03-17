const express = require("express");
const winston = require("winston");
const cors = require("cors");

const episodes = require("../routes/episodes");
const podcasts = require("../routes/podcasts");
const users = require("../routes/users");

const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res, next) => {
    res.send(`Welcome to Press Play API. Documentation available at <a href="https://documenter.getpostman.com/view/9823092/TW74i51A">https://documenter.getpostman.com/view/9823092/TW74i51A.</a>`);
  });

  app.use("/api/episodes", episodes); // use the episodes router;
  app.use("/api/podcasts", podcasts); // use the podcasts router;
  app.use("/api/users", users); // use the users router;


  app.use("*", (req, res) => {
    res.send({ status: false, message: "This is an invalid route", data: null });
  });
  //error middleware
  app.use(error(winston));
};
