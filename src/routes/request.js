const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("sending request uer by ", user);
    // Sending a connection request
    console.log("Sending a connection request");
    res.send(`${user.firstName} sending connection request`);
  } catch (err) {
    res.status(400).send("Something not  went wrong ");
  }
});

module.exports = requestRouter;
