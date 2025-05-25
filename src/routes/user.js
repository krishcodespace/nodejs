const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user')

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName about age skills gender photoUrl"
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

userRouter.get('/user/connections', userAuth, async(req, res) => {
    try{
        const loggedInuser = req.user;
        const userRequests = await ConnectionRequest.find({
            $or:[
                {  toUserId: loggedInuser._id, status: "accepted"},
                {  fromUserId: loggedInuser._id, status: "accepted"}
            ],
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        // }).populate("fromUserId",["firstName", "lastName"]); // second way to write feilds

        // const data = userRequests.map((row) => row.fromUserId);
        const data = userRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInuser._id.toString()){
              return row.toUserId;
            }else{
             return row.fromUserId;
            }
        });
        res.status(200).json({
            message: loggedInuser.firstName + " " + "Connection Request got successfull!",
            data:
            data
        });
    }catch(error){
        res.status(400).json({ message: error})
    }
})

module.exports = userRouter;