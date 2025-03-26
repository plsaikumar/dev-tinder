const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth.js");
const {
  validateEditProfile,
  validateResetPassword,
} = require("../utils/validation.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isProfileEditAllowed = validateEditProfile(req.body);
    const loggedInUser = req.user;
    if (!isProfileEditAllowed) {
      throw new Error("Invalid Input!");
    }

    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));

    await loggedInUser.save();

    res.status(200).json({
      message: loggedInUser.firstName + "profile updated successfully!",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err);
  }
});

profileRouter.patch("/profile/resetPassword", userAuth, async (req, res) => {
  try {
    const newPassWord = validateResetPassword(req.body);
    let loggedInUser = req.user;
    const hashedPassword = await bcrypt.hash(newPassWord, 10);
    console.log(hashedPassword, "hashedPassword");

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.status(200).send("Passowrd Reset Successfully!");
  } catch (err) {
    res.status(400).send("ERROR:" + err);
  }
});

module.exports = profileRouter;
