
const validator = require('validator');

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

}

module.exports = {genderVal, signupValidation, validateEditProfilebody};