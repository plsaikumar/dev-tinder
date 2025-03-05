const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello from server");
});

app.get("/", (req, res) => {
  res.send("Intial route from server");
});
app.get("/u(se)?r",(req,res)=>{
    res.send("Data posted successfully")
})
app.post("/us+er",(req,res)=>{
    res.send("Data posted successfully")
})

app.post("/us*er",(req,res)=>{
    res.send("Data posted successfully")
})
app.get("/u(se)?r",(req,res)=>{
    res.send("Data posted successfully")
})
app.get("/u(se)+r",(req,res)=>{
    res.send("Data posted successfully")
})
app.get("/u(se)*r",(req,res)=>{
    res.send("Data posted successfully")
})
app.listen(3000, () => {
  console.log("Success");
});
