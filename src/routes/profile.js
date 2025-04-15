const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require('../models/user');

const { validateEditProfilebody } = require("../utils/functions");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
   
    if(!validateEditProfilebody(req)){
      throw new Error('Invalid Edit Request');
    }
    const loggedInUser = req.user;
  
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    
    await loggedInUser.save();

    res.send("profile update successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Feed API - GET /feed - get all use from database
profileRouter.get("/feed", userAuth, async (req, res) => {
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

module.exports = profileRouter;
