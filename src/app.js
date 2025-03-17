const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignUpAPI } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const body = req.body;

  const { password } = req.body;

  try {
    validateSignUpAPI(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, "hashedPassword");
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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!validator.isEmail(emailId) || !user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassWord = await bcrypt.compare(password, user.password);
    if (isValidPassWord) {
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER");
      res.cookie("access_token", token);
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookieInfo = req.cookies;
    const accessToken = cookieInfo.access_token;
    if (!accessToken) {
      throw new Error("Authentication Failed");
    }
    const decodedToken = await jwt.verify(accessToken, "DEV@TINDER");
    const user = await User.findOne({ _id: decodedToken._id });
    if (user) {
      res.send(user);
    } else {
      throw new Error("Authentication Failed");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err);
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
    const users = await User.findOne({ emailId: "saketh@gmail.com" });
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
