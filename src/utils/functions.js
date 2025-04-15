const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');


const genderVal = (value) => {
    console.log("gender validation functon run succes fully")
    if(!["male","female","others"].includes(value)){
       throw new Error("Gender data is not valid.")
    }else{
        return value;
    }
} 

const signupValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  console.log(emailId)
  if (!firstName || !lastName) {
    throw new Error("Please Enter fristname & lastname");
  } else if(!validator.isEmail(emailId)) {
    throw new Error("Please Enter vaid email id.")
  } else if(!validator.isStrongPassword(password)) {
    throw new Error("Please Enter strong password")
  } else {
    return req.body;
  }
};

const validateEditProfilebody = (req) => {

  const allowedFields = ["firstName","lastName", "age", "skills", "photoUrl", "gender", "about"];
  const isvalidreq = Object.keys(req.body).every(field => allowedFields.includes(field));
  return isvalidreq;

};

const validateFogotPwdBody = async (req) => {
const user = req.user;
  const allowedFields = ["oldpassword", "newpassword"];

  const isvalidreq = Object.keys(req.body).every(field => allowedFields.includes(field));

  if(!isvalidreq){
    throw new Error('invalid body')
  }
  const isValidexistpwd = await user.validatePassword(req.body.oldpassword);
  console.log('isValidexistpwd', isValidexistpwd);

  if(!isValidexistpwd) {
    throw new Error('please enter your  current password correct!')
  }
  
 let passwordhash;

  if(!validator.isStrongPassword(req.body.newpassword)) {
    throw new Error("Please make your new password stronger!");
  }else{ 
     passwordhash = await bcrypt.hash(req.body.newpassword, 10);
  }
console.log('isvalidreq', isvalidreq)
  return {isvalidreq , passwordhash};

};


module.exports = { genderVal, signupValidation, validateFogotPwdBody };