require("./config/database");
const connectDB = require("./config/database");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require("./models/user");
const { userAuth } = require("./middleware/auth");
const { signupValidation } = require("./utils/functions");

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    // const users = await User.findOne({ emailId: userEmail }); // incase two use with same emailid it will give you first one
    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(404).send("User not found with this email id");
  }
});


//DELETe SPI - DELETE /deleteuser
app.delete("/deleteuser", async (req, res) => {
  const userId = req.query.userId;

  try {
    const isValidUserID = await User.find({ _id: userId });
    if (isValidUserID.length > 0) {
      const userdelete = await User.findByIdAndDelete({ _id: userId });
      // const userdelete = await User.findByIdAndDelete(userId);
      res.send("user delete success fully!");
    } else {
      res.status(400).send("user not found with these id!");
    }
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

//Update api - PATCH /updateuser
app.patch("/update", async (req, res) => {
  const userId = req.query?.userId;
  const userData = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(userData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (userData?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const updateUser = await User.findByIdAndUpdate({ _id: userId }, userData, {
      returnDocument: "after",
      runValidators: true, // apply validation on while update the data
    });
    // console.log(updateUser);
    res.send("User update successfully!");
  } catch (error) {
    res.status(500).send("something went wrong!" + error);
  }
});


connectDB()
  .then(() => {
    console.log("Database Connect succesfully!");
    app.listen(8000, () => {
      console.log("Server run Successfully on 8000");
    });
  })
  .catch((err) => {
    console.log("Database not established!");
  });
