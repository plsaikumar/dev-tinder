const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const activeConnections = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender");

    res.json({
      data: activeConnections,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err);
  }
});

userRouter.get("/user/request/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const connectionRequestData = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser,
          status: "accepted",
        },
        {
          toUserId: loggedInUser,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender")
      .populate("toUserId", "firstName lastName age gender");

    const data = connectionRequestData.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json(data);
  } catch (err) {
    res.status(400).send("ERROR " + err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    let limit = req.query.limit || 10;
    const page = req.query.page || 1;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const data = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser,
        },
        {
          toUserId: loggedInUser,
        },
      ],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");

    const hideExistingUsers = new Set();

    data.forEach((row) => {
      hideExistingUsers.add(row.fromUserId._id);
      hideExistingUsers.add(row.toUserId._id);
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideExistingUsers) },
        },
        {
          _id: { $ne: loggedInUser },
        },
      ],
    }).skip(skip).limit(limit)

    res.json({ users });
  } catch (err) {
    res.status(400).send("ERROR " + err);
  }
});

module.exports = userRouter;
