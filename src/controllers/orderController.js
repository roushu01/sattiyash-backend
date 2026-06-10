const express=require("express")
const Orders=require("../models/orderModel.js")
const Address=require("../models/addressModel.js")
const product=require("../models/productModel.js")
const jwt=require("jsonwebtoken")
const User = require("../models/usermodel.js")
const OrderPlaced=async(req,res)=>{
    try {
       console.log("BODY:", req.body);

    const {
      products,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      coins,
    } = req.body;

    const userID = req.user.id;
    if (coins > 0) {
        const user = await User.findById(userID);

        user.walletBalance -= coins;

        await user.save();
}


    // Build products array for order
    const orderProducts = [];

    for (const item of products) {
      const Product = await product.findById(
        item.productID
      );

      if (!Product) {
        return res.status(404).json({
          message: `Product not found: ${item.productID}`,
        });
      }

      orderProducts.push({
        productID: Product._id,
        productName: Product.name,
        price: Product.Discounted_price,
        image: Product.image,
        quantity: item.quantity,
        size: item.size,
      });
    }

    const order = await Orders.create({
      userID,

      products: orderProducts,

      shippingAddress: {
        firstName:
          shippingAddress.firstName,
        lastName:
          shippingAddress.lastName,
        address:
          shippingAddress.address,
        city:
          shippingAddress.city,
        state:
          shippingAddress.state,
        country:
          shippingAddress.country,
        pincode:
          shippingAddress.pincode,
      },

      totalAmount,

      paymentMethod:
        paymentMethod || "COD",

      paymentStatus:
        paymentStatus || "Pending",

      orderStatus:
        orderStatus || "Pending",
      coins  
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
//update the quantity of product when order is confirmed
const updateOrderQuanttiy=async(req,res)=>{
    try{
        const {id,status}=req.body;
        // const token=req.cookies.token
        // const decode=jwt.verify(token,JWT_PRIVATE_KEY)
        // const userID=decode.id
        const order=await Orders.findById(id)
        if (!order){
            return res.status(404).json({
                message:"Order not found"
            })

        }
        const previousStatus=order.orderStatus
        if(previousStatus==="Pending"&& status==="Confirmed"){
            for (const item of order.products){
                const Product =await product.findById(item.productID)
                if (!product) continue;
                if (Product.quantity<item.quantity){
                    return res.status(400).json({message:`${Product.Title} is out of stock`})

                }
                Product.Quantiy-=item.quantiy
                await Product.save()
            }
        }
        if(previousStatus==="Confirmed"&& status==="Cancelled"){
            for (const item of order.products){
                const Product =await product.findById(item.productID)
                if (!product) continue;
                if (Product.quantity<item.quantity){
                    return res.status(400).json({message:`${Product.Title} is out of stock`})

                }
                Product.Quantiy+=item.quantiy
                await Product.save()
            }
        }
        order.orderStatus=status;
        await order.save()
        return res.status(200).json({
            message:"Order status updated successfully",
            order
        })
    }catch(error){
        console.log(error)
        return res.status(400).json({error:error})
    }
}
const getOrder=async(req,res)=>{
    try{
     const userID = req.user.id;
    console.log(userID)
    const order=await Orders.findOne({userID})
    if (!order){
        return res.status(200).json({message:"orders not find"})
    }
    return res.status(200).json({message:"orders find",order})
}catch(error){
    console.log(error)
    return res.status(400).json({message:error})
}
}
const updateOrderStatus=async(req,res)=>{
    try{
        const {id,status}=req.body
        console.log(status)
        const order = await Orders.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }   
        order.orderStatus=status
        await order.save()
        
        return res.status(200).json({message:"order updated successfully"})
    }catch(error){
     console.log(error)
     return res.status(400).json({message:error})
    }
}

module.exports={OrderPlaced,getOrder,updateOrderStatus,updateOrderQuanttiy}