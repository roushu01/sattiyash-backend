const express=require('express')
const jwt=require('jsonwebtoken')
const router=express.Router()
const Cart=require('../models/cartModel.js')
const cookieParser=require("cookie-parser")
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userID = req.user.id; // from middleware

  const alreadyInCart = await Cart.findOne({ userID, productId });

  if (alreadyInCart) {
    return res.status(400).json({ message: "Product already in cart" });
  }

  await Cart.create({ userID, productId });

  return res.status(200).json({ message: "Product added to cart successfully" });
};
const DeleteFromCart=async(req,res)=>{
    console.log("Delete API is hit")
    const productId = req.params.id;
    const userID = req.user.id;
    const alreadyInCart=await Cart.findOne({userID,productId})
    if(!alreadyInCart){
        return res.status(400).json({message:"Product not in cart"})
    }
    try{
        await Cart.deleteOne({userID,productId})
        res.status(200).json({message:"Product deleted from cart successfully"})
    } catch (error) {
        res.status(500).json({message:"Error deleting product from cart"})
    }
}
const updateCart=async(req,res)=>{
    const userID = req.user.id;
    const cartItem=await Cart.findOne({userID})
    if (!cartItem) {

        return res.status(404).json({
            message: "Cart item not found"
        })
    }
    console.log(cartItem)
    cartItem.Quantity=quantity
    try{
        await cartItem.save()
        return res.status(200).json({message:"Cart updated successfully"})
    } catch (error) {
        return res.status(500).json({message:"Error updating cart"})
    }
}
const getCartItems = async (req,res)=>{

                console.log("Get Cart Items hit");

                try{

                const userID = req.user.id;

                const cartItems =
                await Cart
                .find({ userID })
                .populate("productId");

                return res.status(200).json({
                cartItems
                });

                }
                catch(error){

                console.log(error);

                return res.status(401).json({
                cartItems:[]
                });

}

}
module.exports={addToCart, DeleteFromCart, updateCart, getCartItems}