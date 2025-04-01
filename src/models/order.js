const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    vendorName:{
        type:String, 
    },
    companyName:{
        type:String,
    },
    
})