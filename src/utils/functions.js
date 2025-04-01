
const genderVal = (value) => {
    console.log("gender validation functon run succes fully")
    if(!["male","female","others"].includes(value)){
       throw new Error("Gender data is not valid.")
    }else{
        return value;
    }
}

module.exports = genderVal;