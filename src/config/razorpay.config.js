const razorpay=require('razorpay');
const dotenv=require('dotenv');
dotenv.config();
const createRazorpayInstance=()=>{
    return new razorpay({
        key_id:process.env.RAZORPAY_KEY_ID, 
        key_secret:process.env.RAZORPAY_KEY_SECRET
    })
}

module.exports.createRazorpayInstance=createRazorpayInstance;

module.exports.razorpayVerifyPayment=async (req,res)=>{
    const {orderId,razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
    const instance=createRazorpayInstance();
    try {
        const response = await instance.orders.fetch(razorpay_order_id);
        if(response && response.razorpay_payment_id === razorpay_payment_id){
            res.json({status:"success",message:"Payment successful"});
        } else {
            res.json({status:"failure",message:"Payment failed"});
        }
    } catch (error) {
        res.json({status:"error",message:error.message});
    }
}

module.exports.razorpayCreateOrder=async (req,res)=>{
    const {products,shippingAddress,coins} = req.body;
    const instance=createRazorpayInstance();
    try {
        const response = await instance.orders.create({
            amount: coins * 100,
            currency: 'INR',
            receipt: orderId,
            notes: {
                products: products,
                shippingAddress: shippingAddress
            }
        });
        res.json({status:"success",message:"Order created",data:response});
    } catch (error) {
        res.json({status:"error",message:error.message});
    }
}

