let NODE_ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `./.env.${NODE_ENV}` });
const express = require("express");
const app = express();
const winston = require("winston");

require("./config/joiObjectId")();
require("./config/logging")();
require("./config/db")();
require("./routes/index")(app);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  winston.info("app listening at port 4000");
});
