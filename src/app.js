const express = require("express");
const adminAuth = require("./middleware/auth");
const app = express();


// Get /user => middleware chain => request handler
// wahtever request come to express server first it serach for route and then it go through all middlerware chain till the reach response form request handler if they not found 
// any resopone then throw error


app.get("/admin/userdata", adminAuth, (req, res, next) => {
  res.send({
    id:"656484155800",
    name:"krishn",
    isAdmin:true,
  })
});

app.get("/admin/routes", adminAuth, (req, res, next) => {
  res.send({
    id:"879789",
    name:"char rasta",
    isAdmin:true,
  })
});

app.get('/', (req, res) => {
res.send("hello world")
})

app.use(
  "/",
  (req, res, next) => {
    // this second callback function know as Route Handler.
    console.log("Handling the route user");
    next();
    // res.send("Response Hanler / router!!");
  },
);

app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling the route user");
    next();
    // res.send("Response Hanler /user Route ");
  },
  (req, res, next) => {
    next();
    // res.send("2nd Hanler /user Route ");
  },  
  (req, res, next) => {
    next();
    res.send("3rd Route Hanler /user Route ");
  },
);


// you can also keep rout handler in one arry it's work same as normal Rout Handlers
// warpping Rout Handlers insdie array not make any impact
// app.use("/data",[()=>{},()=>{}])


app.listen(3676, () => {
  console.log("Server run Successfully on 3676");
});
