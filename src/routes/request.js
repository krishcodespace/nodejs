const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user')

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const validStatus = ["ignored", "interested"];
      const isvalidstatus = validStatus.includes(status);
      if (!isvalidstatus) {
       return  res.status(400).json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({ message: "Connection Request Already Exists!!" });
      }

    // Create requestInfo message
    // const requestInfo = `${req.user.firstName} is sending a connection request to ${toUser.firstName}`;
      // Sending a connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
        // requestInfo
        
      });
      const data = await connectionRequest.save();
   
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
      // res.send(`${user.firstName} sending connection request`);
    } catch (err) {
      res.status(400).send("Faild to sent request:" + err);
    }
  }
);

// requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res) => {

//   //only toUserId which accept the request
//   //loggedIn === toUserId
//   //request status not be ignored or other only interested status we do accept or rejection 
//   //status = interested
//   //requestId should be validate 
//   console.log("req", req.user)
//   console.log("req", req.params)

//   const allowedStatus = ["interested"];
//   if(!allowedStatus.includes(req.params.status)){
//     res.status(400).json({
//       message:"Invalid Status!"
//     })
//   }

//   if(req.user._id === req.params.requestId) {
//     res.send("your logged user is the request viewer user");
//   }

//   const isValidReqId =  await ConnectionRequest.findById(req.params.requestId);

//   if(!isValidReqId){
//     res.status(400).send("Invalid RequestId");
//   }

// })

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedReviewStatus = ["accepted", "rejected"];

    // 1. Validate status
    if (!allowedReviewStatus.includes(status)) {
      return res.status(400).json({ message: "status not allowed." });
    }

    // 2. Find the connection request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    // 4. Update the status
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    return res.status(200).json({
      message: `Connection request has been ${status} successfully.`,
      data:data
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
});


requestRouter.get("/getallrequest", userAuth, async (req, res) => {
  try {
    const allUsers = await ConnectionRequest.find({});
    res.json({
      message: "all request get succesfully!",
      allUsers,
    });
    // res.send(`${user.firstName} sending connection request`);
  } catch (err) {
    res.status(400).send("Faild to sent request:" + err);
  }
});

module.exports = requestRouter;
