const express = require('express');
const bcrypt  = require('bcrypt');
const authRouter = express.Router();

const User = require('../models/user');
const { signupValidation } = require('../utils/functions');


//ADD NEW USER - POST /signup
authRouter.post("/signup", async (req, res, next) => {
  // in most monggos function is retun promise so we add async/await
  try {
    const isUserExist = await User.find({ emailId: req.body.emailId });
    if (isUserExist.length === 0) {
      const sanitizeBody = signupValidation(req);
      const { firstName, lastName, emailId, password } = sanitizeBody;
      const passwordhash = await bcrypt.hash(password, 10);
      console.log("passwordhash", passwordhash);
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

//Login Api - POST/LOGIN
authRouter.post("/login", async (req, res, next) => {
  try {
  const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    // console.log("user", user);
    if (!user) {
      throw new Error("Inavlid credentials!");
    }
    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = user.getJWT();
      console.log('token', token);
      res.cookie('token', token);
      res.send("Login successfully!");
    } else {
      throw new Error("Inavlid credentials");
    }
  } catch (err) {
    res.status(400).send("Error saving user:" + err.message);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  }).send('Logout succesfully!');
})


module.exports = authRouter;