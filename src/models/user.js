const mongoose = require('mongoose');
const genderVal = require('../utils/functions');

const userSchema = mongoose.Schema({
    firstName :{
      type : String,
      required: true,
      minLenght: 4,
      maxLength:100,
    },
    lastName :{
        type: String
    },
    emailId :{
        type: String,
        lowercase:true,
        required: true,
        unique: true,
        trim:true,
    },
    password :{
        type: String
    },
    age :{
        type: Number,
        min: 18,
    },
    gender :{
        type: String,
        validate : genderVal,
        // validate(value){
        //     console.log("gender validation functon run succes fully");
        //     if(!["male","female","others"].includes(value)){
        //        throw new Error("Gender data is not valid.")
        //     }
        // }
    },
    photoUrl:{
        type: String,
    },
    about:{
        type: String,
        default:"i am explore dev tinder to learn backend"
    },
    skills:{
        type:[String]
    }
}, { timestamps: true });

module.exports  = mongoose.model('User', userSchema);
