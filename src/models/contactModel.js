const mongoose=require("mongoose")
const contactSchema=new mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
    },
    Name:String,
    message:String,
    email:String
})
const contact=mongoose.model("contact",contactSchema)
module.exports=contact