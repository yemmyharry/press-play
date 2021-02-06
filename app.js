require("dotenv").config();
const express = require("express");
const app = express();

require("./config/joiObjectId")();
require("./config/logging")();
require("./config/db")();
require("./routes/index")(app);
 
app.listen(process.env.PORT || 4000, () => {
  console.log("app listening at port 4000");
});
