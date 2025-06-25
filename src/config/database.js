const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://KRK:SqETgSWnP-6Reg-@.ppzjv.mongodb.net/devTinder")
}

module.exports = connectDB;
