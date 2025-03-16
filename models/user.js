const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 32,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 9,
      maxLength: 16,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender Type");
        }
      },
    },
    about: {
      type: String,
      default: "Hello",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
