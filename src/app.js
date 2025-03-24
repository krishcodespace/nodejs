const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    // this second callback function know as Route Handler.
    console.log("Handling the route user");
    next();
    // res.send("Response!!");
  },
  (req, res, next) => {
    console.log("Handling the route user2!!");
    next();
    // res.send("2nd Response!!");
  },
  (req, res, next) => {
    console.log("Handling the route user3!!");
    next();
    // res.send("3nd Response!!");
  },
  (req, res, next) => {
    console.log("Handling the route user4!!");
    // res.send("4nd Response!!");
    next();
  }
);

// you can also keep rout handler in one arry it's work same as normal Rout Handlers
// warpping Rout Handlers insdie array not make any impact
// app.use("/data",[()=>{},()=>{}])


app.listen(3676, () => {
  console.log("Server run Successfully on 3676");
});
