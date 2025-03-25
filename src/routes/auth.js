const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpAPI } = require("../utils/validation");
const User = require("../models/user.js");
const validator = require("validator");


const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
  const body = req.body;
  const { password } = req.body;
  try {
    validateSignUpAPI(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...body,
      password: hashedPassword,
    });

    await newUser.save();
    res.send("User Data Saved Successfully");
  } catch (err) {
    res.status(400).send("Error while saving data" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!validator.isEmail(emailId) || !user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassWord = await user.validatePassword(password);
    if (isValidPassWord) {
      const token = await user.getJWT();
      res.cookie("access_token", token);
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Delete Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = authRouter;
