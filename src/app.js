const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello from server");
});

app.use("/", (req, res) => {
  res.send("Intial route from server");
});
app.listen(3000, () => {
  console.log("Success");
});
