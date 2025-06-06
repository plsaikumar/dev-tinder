const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Invalid status type " + status,
        });
      }

      const isToUserValidUser = await User.findById(toUserId);

      if (!isToUserValidUser) {
        throw Error("User not found!");
      }

      const isUserIdExist = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (isUserIdExist) {
        throw Error("User Connection already exist");
      }

      const newConnection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnection.save();

      res.status(200).json({
        message:
          user.firstName +
          " is " +
          status +
          " in " +
          isToUserValidUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Invalid Status Type",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(400).json({
          message: "Connection Request not Found",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json(data);
    } catch (err) {
      res.status(400).send("ERROR " + err);
    }
  }
);

module.exports = requestRouter;
