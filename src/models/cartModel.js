const mongoose=require('mongoose')
const cartSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    size:{
        type:String,
        default:"s"
    }
})
const Cart=mongoose.model('Cart',cartSchema)
module.exports=Cart