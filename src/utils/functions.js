
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

module.exports = {genderVal, signupValidation};