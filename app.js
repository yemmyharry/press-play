require("dotenv").config();
const express = require("express");
const app = express();
const winston = require("winston");

require("./config/joiObjectId")();
require("./config/logging")();
require("./config/db")();
require("./routes/index")(app);

app.listen(process.env.PORT || 4000, () => {
  winston.info("app listening at port 4000");
});
