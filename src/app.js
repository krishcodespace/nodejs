const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res, next) => {
  const userObj = {
    firstName: "krishn",
    lastName: "ofjiefwjfie",
    email: "Krishn@gmail.com",
  };

  // creating a new instace of user model
  // const user = new User(userObj);

//////////////////////////OR////////////////////////////

  const user = new User({
    firstName: "krishn",
    lastName: "ofjiefwjfie",
    email: "Krishn@gmail.com",
    password: "jfoijefiw@546454",
  });

  // in most monggos functio is retun promise so we add async/await
  await user.save();

  res.status(200).send("User Add successfully.")
});

connectDB()
  .then(() => {
    console.log("Database Connect succesfully!");
    app.listen(3676, () => {
      console.log("Server run Successfully on 3676");
    });
  })
  .catch((err) => {
    console.log("Database not established!");
  });
