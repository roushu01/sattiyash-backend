const express=require('express')
const jwt=require('jsonwebtoken')
const cookies=require("cookie-parser")
const router=express.Router()
const User=require('../models/usermodel.js')
const Referral=require("../models/refferedModel.js")
const Address=require('../models/addressModel.js')
const generateReferralCode = require("../utils/generateRefferalCode.js");
const { findById } = require('../models/orderModel.js')


const registeruser = async (req, res) => {
  try {
    const { clerkId, name, email, phone,refferalCode } = req.body;
    console.log(refferalCode)
    
    console.log("API IS HIT");
    let referredUser = null;

    if (refferalCode) {
      referredUser = await User.findOne({
        refferalCode
      });
      console.log(referredUser)
      if (!referredUser) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }
    }
    const lowercaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      $or: [
        { email: lowercaseEmail },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      clerkId,
      name,
      email: lowercaseEmail,
      phone,
      referredBy: referredUser?._id,
      refferalCode:generateReferralCode(),
    });
    if (referredUser) {
      await Referral.create({
        referrer: referredUser._id,
        referredUser: user._id,
        rewardAmount: 10,
       
  });
      await User.findByIdAndUpdate(
      referredUser._id,
      {
        $inc: {
          walletBalance: Math.floor(Math.random()*10)+1,
          Network: 1,
        },
      },
      { new: true }
    );
}
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_PRIVATE_KEY
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};
const logoutUser = (req, res) => {
  try {
    // clear JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

const getReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Data found",
      referralCode: user.refferalCode,
      walletBalance: user.walletBalance,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
const getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    const referrals = await Referral.find({
      referrer: user._id,
    }).populate("referredUser");
     
    res.json({
      referralCode: user.referralCode,
      walletBalance: user.walletBalance,
      referrals,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
const getalluser=async(req,res)=>{
    try{
      const user=await User.find()
      return res.status(200).json({user})
    }catch(error){
     console.log(error)
     return res.status(400).json({error:error})
    }
}
const addAddress=async(req,res)=>{
    try{
    const {Landmark,City,Pincode,State,Country}=req.body
    const token=req.cookies.token
   
    const decode=jwt.verify(token,process.env.JWT_PRIVATE_KEY)
    const userID=decode.id
   
    const address=await Address.create({userID,Landmark,City,Pincode,State,Country})
    return res.status(200).json({message:"User created Successfully",address})
    }
    catch(error){
      return res.status(400).json({message:error})
    }

}
const authenticateUser=async(req,res)=>{
    const {email}=req.body
    const lowercaseEmail=email.toLowerCase()
    const user=await User.findOne({email:lowercaseEmail})
    
    console.log(user)
    if (!user){
        return res.status(400).json({message:"Email not found"})

    }
    const token=jwt.sign({
        id:user._id
    },process.env.JWT_PRIVATE_KEY)
    
    res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true only when using HTTPS
  sameSite: "lax",
});
    res.status(200).json({message:"login successfull"})
}
//delete and user
const deleteUser=async(req,res)=>{
    try{
        const id=req.params.id
        const user=await User.findByIdAndDelete(id)
     
        return res.status(200).json({message:"User deleted successfully",user})
    }catch(error){
        console.log(error)
        return res.status(400).json({error:error})
    }
    
}
const deleteAddress=async(req,res)=>{
    try{
        const id=req.params.id
        const address=await Address.findByIdAndDelete(id) 
        return res.status(200).json({message:"User deleted successfully",user})
    }catch(error){
        console.log(error)
        return res.status(400).json({error:error})
    }
    
}

module.exports={registeruser,logoutUser ,getReferralInfo,authenticateUser,addAddress,getalluser,deleteUser,deleteAddress,getReferralCode}