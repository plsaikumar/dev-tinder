const express = require("express");
const connectDB = require("../config/database");
const app = express();
const User = require("../models/user.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const body = req.body;
  const newUser = new User(body);

  try {
    await newUser.save();
    res.send("User Data Saved Successfully");
  } catch (err) {
    res.status(400).send("Error while saving data" + err);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userInfo = await User.find({ emailId: req.body.emailId });
    if (userInfo.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(userInfo);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/oneUser", async (req, res) => {
  try {
    const users = await User.findOne({ emailId: "lak@gmail.com" });
    if (!users) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Delete Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.id;
  const userInfo = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, userInfo);
    res.send("User Data Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userInfo = req.body;
  try {
    const ALLOWED_CHANGES = [
      "age",
      "firstName",
      "lastName",
      "password",
      "gender",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(userInfo).every((k) =>
      ALLOWED_CHANGES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    const user = await User.findByIdAndUpdate(userId, userInfo);
    res.send("User Data Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

app.patch("/userByEmail", async (req, res) => {
  const emailId = req.body.emailId;
  const userInfo = req.body;
  try {
    const user = await User.findOneAndUpdate(
      {
        emailId: emailId,
      },
      userInfo,
      {
        returnDocument: "before",
        runValidators: true,
      }
    );
    res.send("User Data Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

app.put("/user", async (req, res) => {
  const userId = req.body.id;
  const userInfo = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, userInfo);
    res.send("User Data Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

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
