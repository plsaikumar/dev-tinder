const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendRequestConnection", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Request Send Successfully");
  res.status(200).send(user.firstName + "send the connection request!");
});

module.exports = requestRouter;
