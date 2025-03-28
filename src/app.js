const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res, next) => {
  // in most monggos functio is retun promise so we add async/await
  const user = await new User(req.body);
  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving user:" + err.message);
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
