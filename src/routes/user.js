const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user')

const userRouter = express.Router();

userRouter.get('/user/requests/recevied',userAuth, async(req, res) => {

    const loggedInuser = req.user;

    const userRequests = await ConnectionRequest.find({
        toUserId: loggedInuser._id,
        status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");
    // }).populate("fromUserId",["firstName", "lastName"]); // second way to write feilds

    res.status(200).json({
        message: loggedInuser.firstName + " " + "Connection Request got successfull!",
        userRequests
    });

})

module.exports = userRouter;