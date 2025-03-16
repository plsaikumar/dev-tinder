const mongoose = require("mongoose");

const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://plsaikumar72:ISvtbf60LZPJxLPb@learnnode.g97id.mongodb.net/devTinder"
  );
};

module.exports =  connectDB
