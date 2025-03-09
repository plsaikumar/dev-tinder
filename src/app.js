const express = require("express");
const app = express();

const { adminAuth } = require("./utils.js");

app.all("/admin", (req, res, next) => {
  const token = "xyzas";
  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("Not Authenticated");
  }
});

app.get("/admin/deleteAllData", adminAuth, (req, res) => {
  res.send("Delete from DB");
});

app.get("/admin/getAllData", adminAuth, (req, res) => {
  res.send("Get Data from DB");
});

app.get("/", (req, res) => {
  res.send("Intial route from server");
});
app.get("/u(se)?r", (req, res) => {
  res.send("Data posted successfully");
});
app.post("/us+er", (req, res) => {
  res.send("Data posted successfully");
});

app.post("/us*er", (req, res) => {
  res.send("Data posted successfully");
});
app.get("/u(se)?r", (req, res) => {
  res.send("Data posted successfully");
});
app.get("/u(se)+r", (req, res) => {
  res.send("Data posted successfully");
});
app.get("/u(se)*r", (req, res) => {
  res.send("Data posted successfully");
});
app.listen(3000, () => {
  console.log("Success");
});
