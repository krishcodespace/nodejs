require("./config/database");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/database");
const User = require("./models/user");
const { signupValidation } = require("./utils/functions");
const user = require("./models/user");

app.use(express.json());
app.use(cookieParser());

//Login Api - POST/LOGIN
app.post("/login", async (req, res, next) => {
  try {
  const { emailId, password } = req.body;
    const isUserExist = await User.find({ emailId: emailId });
    // console.log("isUserExist", isUserExist);
    if (!isUserExist) {
      throw new Error("Inavlid credentials!");
    }
    const isValidPassword = await bcrypt.compare(password, isUserExist?.[0]?.password);

    if (isValidPassword) {
      // res.cookie("jwoefwjefijwijefiwjefiwjfeio");
      const token = jwt.sign({_id : user.userId},"krishn@52365");
      console.log
      res.cookie('token', token)
      res.send("Login successfully!");
    } else {
      throw new Error("Inavlid credentials");
    }
  } catch (err) {
    res.status(400).send("Error saving user:" + err.message);
  }
});

app.get("/getuser", async (req, res) => {
  // const userId = req.query.userId;
  const {token} = req.cookies;
  
  if(!token){
    throw new Error("Inavlid tken")
  }
  
  try {
    console.log("cookies", token);
    const decodeMessage = jwt.verify(token,"krishn@52365");
    console.log("decodeMessage", decodeMessage);
     
    res.send("cookies send succesffully!");
    // const users = await User.find({ _id: userId });
    // const users = await User.findOne({ emailId: userEmail }); // incase two use with same emailid it will give you first one
    // if (users.length > 0) {
    //   res.status(200).send(users);
    // } else {
    //   res.status(400).send("User not found");
    // }
  } catch (error) {
    res.status(404).send("User not found with this id");
  }
});


//ADD NEW USER - POST /signup
app.post("/signup", async (req, res, next) => {
  // in most monggos functio is retun promise so we add async/await
  try {
    const isUserExist = await User.find({ emailId: req.body.emailId });
    if (isUserExist.length === 0) {
      const sanitizeBody = signupValidation(req);
      const { firstName, lastName, emailId, password } = sanitizeBody;
      const passwordhash = await bcrypt.hash(password, 10);
      console.log(passwordhash);
      const user = await new User({
        firstName,
        lastName,
        emailId,
        password: passwordhash,
      });
      await user.save();
      res.send("User Added successfully!");
    } else {
      res.status(200).send("User Already exist with these email id!");
    }
  } catch (err) {
    res.status(400).send("Error saving user:" + err.message);
  }
});

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



//Feed API - GET /feed - get all use from database
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    // res.status(200).send(allUsers);
    res.send({
      data: allUsers,
      status: 200,
      message: "you got users!",
      errorMessage: null,
    });
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
});

//DELETe SPI - DELETE /deleteuser
app.delete("/deleteuser", async (req, res) => {
  const userId = req.query.userId;
  console.log("userId", userId);

  try {
    const isValidUserID = await User.find({ _id: userId });
    console.log(isValidUserID);
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
    console.log(updateUser);
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
