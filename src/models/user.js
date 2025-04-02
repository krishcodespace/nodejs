const mongoose = require("mongoose");
const validator = require("validator");
const {genderVal} = require("../utils/functions");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLenght: 4,
      maxLength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error("Invalid email address: " + value);
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: genderVal,
      // validate(value){
      //     console.log("gender validation functon run succes fully");
      //     if(!["male","female","others"].includes(value)){
      //        throw new Error("Gender data is not valid.")
      //     }
      // }
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "i am explore dev tinder to learn backend",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
