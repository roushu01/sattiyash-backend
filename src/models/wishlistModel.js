const mongoose=require('mongoose');
const wishListSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true
    }
},{timestamps:true})
const WishList=mongoose.model("WishList",wishListSchema)
module.exports=WishList