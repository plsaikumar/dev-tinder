const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter, profileRouter, requestRouter);

connectDB()
  .then(() => {
    console.log("Database Connected SuccesFully");
    app.listen(3000, () => {
      console.log("Listen to 3000 port");
    });
  })
  .catch((err) => {
    console.log("Not Connected to Database  SuccesFully", err);
  });
