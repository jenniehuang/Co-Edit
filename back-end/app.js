const express = require("express");
const dotenv = require("dotenv").config();
const authRoute = require("./routes/auth-routes");
const docRoute = require("./routes/doc-routes");
const userRoute = require("./routes/user-routes");

const cors = require("cors");
const connectDB = require("./config/mongodb");
const passport = require("passport");
require("./config/passport")(passport);

const app = express();
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// MW
app.use(cors());

//bodyparser for json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/doc", passport.authenticate("jwt", { session: false }), docRoute);
app.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

module.exports = app;
