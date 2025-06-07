const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user')

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName about age skills gender photoUrl";

userRouter.get('/user/requests/recevied',userAuth, async(req, res) => {

    const loggedInuser = req.user;

    const userRequests = await ConnectionRequest.find({
        toUserId: loggedInuser._id,
        status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
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

userRouter.get('/user/feed', userAuth, async(req, res) => {
    try{
        //1. user show all other users card except own card
        //2. not show their connections card on feed
        //3. not show ignored people card 
        //4. not show already send connection request
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;

        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId")
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName"); 

     const hideUsersFromFeed = new Set();

     connectionRequests.forEach((req) =>{ 
        hideUsersFromFeed.add(req.fromUserId).toString();
        hideUsersFromFeed.add(req.toUserId).toString();
    });

    console.log(hideUsersFromFeed);
      
    const users = await User.find({
        $and:[
            { _id : { $nin: Array.from(hideUsersFromFeed)}},
            { _id : { $ne: loggedInUser._id}}
        ]
    })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

    res.status(200).json({
        message:"Succesfully fetch feed data",
        data: users,
        metadata:{
          pageNumber: page,
          rowPerPage: limit
        }
    });

    }catch(error){
        res.status(400).json({message : error.message})
    }
})

module.exports = userRouter;