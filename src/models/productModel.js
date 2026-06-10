const connectDB=require("../controllers/dbconfig.js")
const mongoose=require("mongoose")
const productSchema=new mongoose.Schema({
    Category:{
        type:String,
        required:true
    },
    name:String,
    parentCategory:String,
    
    Description:String,
    Rating:Number,
    image:String,
    color:[String],
    Size:[String],
    Material:String,
    Quantity:Number,
    price:Number,
    Discount:Number,
    Discounted_price:Number

})
const product=mongoose.model('product',productSchema) 
module.exports=product