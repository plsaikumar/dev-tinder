const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookieInfo = req.cookies;
    const accessToken = cookieInfo.access_token;
    if (!accessToken) {
      throw new Error("Authentication Failed");
    }
    const decodedToken = await jwt.verify(accessToken, "DEV@TINDER");
    const user = await User.findOne({ _id: decodedToken._id });
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error("Authentication Failed");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err);
  }
};

module.exports = {
  userAuth: userAuth,
};
