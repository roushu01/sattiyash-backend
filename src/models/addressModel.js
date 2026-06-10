const mongoose=require("mongoose")
const addressSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Landmark:String,
    City:String,
    Pincode:Number,
    State:String,
    Country:String
})
const Address=mongoose.model("Address",addressSchema)
module.exports=Address