const express=require("express")
const contact=require("../models/contactModel.js")
const jwt=require("jsonwebtoken")
const createContact=async(req,res)=>{
    try{
    const {name,message,email}=req.body
    
    const userId=req.user.id
    const contacts=await contact.create({userId,name,message,email})
    return res.status(200).json({message:"Contact Created",contacts})
}catch(error){
    console.log("Contact not created",error)
    return res.status(400).json({message:"contact not created",error})
}
}
//for admin
const getContact=async(req,res)=>{
    try{
        const contacts=await contact.find()
        if (!contacts){
            return res.status(404).json({message:"No database found"})
        }
        return res.status(200).json({message:"contact found",contacts})
    }catch(error){
      console.log(error)
      return res.status(400).json({message:error})
    }

}

const deleteContact=async(req,res)=>{
    try{
        const {id}=req.params
        const contactDelete=await contact.findByIdAndDelete(id)
        return res.status(200).json({message:"Contact information deleted",contactDelete})
    }catch(error){
        console.log(error)
        return res.status(400).json({error:error})
    }
}
module.exports={createContact,getContact,deleteContact}
