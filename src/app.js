require("./config/database");
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//ADD NEW USER - POST /signup
app.post("/signup", async (req, res, next) => {
  // in most monggos functio is retun promise so we add async/await
  const user = await new User(req.body);
  try {
    const isUserExist = await User.find({ emailId : req.body.emailId});
    if(isUserExist.length === 0){
      await user.save();
      res.send("User Added successfully!");
    }else{
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

app.get("/getuser", async (req, res) => {
  const userId = req.query.userId;
  console.log("userID", req.query);
  try {
    const users = await User.find({ _id: userId });
    console.log(users);
    // const users = await User.findOne({ emailId: userEmail }); // incase two use with same emailid it will give you first one 
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(400).send("User not found");
    }
  } catch (error) {
    res.status(404).send("User not found with this id");
  }
});

//Feed API - GET /feed - get all use from database
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
      // res.status(200).send(allUsers);
      res.send({
        "data":allUsers,
        "status":200,
        "message":"you got users!",
        "errorMessage": null
      })

  } catch (error) {
    res.status(404).send("Something went wrong");
  }
});

//DELETe SPI - DELETE /deleteuser 
app.delete("/deleteuser", async (req, res) => {
   const userId = req.query.userId;
  console.log("userId",userId);

   try {
      const isValidUserID = await User.find({_id: userId});
      console.log(isValidUserID)
      if(isValidUserID.length > 0 ){
        const userdelete = await User.findByIdAndDelete({_id: userId});
        // const userdelete = await User.findByIdAndDelete(userId);
        res.send("user delete success fully!")
      }else{
        res.status(400).send("user not found with these id!")
      }
   } catch (error) {
    res.status(400).send("Something went wrong!");
   }
});

//Update api - PATCH /updateuser
app.patch("/update", async(req, res) => {
 const userId = req.body._id;
 const userData = req.body;

 try {
  const upateUser = await User.findByIdAndUpdate({ _id : userId}, userData);
  res.send("User update successfully!") 
 } catch (error) {
  res.status(500).send("something went wrong!");
 }
})

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
