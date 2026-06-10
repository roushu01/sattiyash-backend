const mongoose=require("mongoose");
const referralSchema=new mongoose.Schema(
    {
        referred:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        referredUser:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        rewardedAmount:Number,
       
    },
    {
        timestamps:true,
    }
)
module.exports=mongoose.model("Referral",referralSchema)