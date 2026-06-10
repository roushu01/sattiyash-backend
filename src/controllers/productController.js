const express=require('express')
const product=require('../models/productModel.js')
const uploadFile=require('../Services/imageurl.js')
const multer=require("multer")
const upload=multer({storage:multer.memoryStorage()})
const createProduct=async(req,res)=>{
  
   try{
   const imageResult=await uploadFile(req.file.buffer)
   const products = await product.create({
    Category:req.body.Category,
    name:req.body.name,
    parentCategory:req.body.parentCategory,
    Description:req.body.Description,
    image:imageResult.url,
    color:req.body.color,
    Size:req.body.Size,
    Material:req.body.Material,
    Quantity:req.body.Quantity,
    price:req.body.price,
    Discount:req.body.Discount,
    Discounted_price:req.body.Discounted_price
   })
    return res.status(200).json({message:"Product Created Successfully"})
   }catch(error){
    return res.status(400).json({message:error})
   }

}
const getallProduct=async(req,res)=>{
    try{
      const products=await product.find()
      return res.status(200).json({message:"Product fetched successfully",data:products})
    }catch(error){
        return res.status(400).json({message:error})
    }
    
}
const getProductById=async(req,res)=>{
    try{
        console.log(req.params.id)
        const products=await product.findById(req.params.id)
        if (!products){
            return res.status(400).json({message:"Product not found"})
        }
        return res.status(200).json({message:"Product found",products})
    }catch(error){
        return res.status(400).json({message:error})
    }
}
const getProductsByName=async(req,res)=>{
    try{
        console.log(req.params.name)
        const products=await product.find({
            name:req.params.name
        })
        if (!product){
            return res.status(400).json({message:"Product not found"})
        }
        return res.status(200).json({message:"Product found",products})
    }catch(error){
        return res.status(400).json({message:error})
    }
}
const getProductByParentCategory=async(req,res)=>{
    try{
    console.log("Parent Category is hit")    
    const category=req.params.id
    const products=await product.find({parentCategory:category})
    return res.status(200).json({message:"Product find sucessfully",products:products})
    }catch(error){
        return res.status(400).json({error:error})
    }
}
const getProductByCategory=async(req,res)=>{
    try{
    console.log(" Category is hit")    
    const category=req.params.id
    const products=await product.find({Category:category})
    console.log(products)
    return res.status(200).json({message:"Product find sucessfully",products})
    }catch(error){
        return res.status(400).json({error:error})
    }
}
// const buyProduct=async(req,res)=>{
//     const {_id,quantity}=req.body
//     console.log("Body:", req.body);
//     const productId= await product.findOne({_id})
//     if (!productId){
//          return res.status(400).json({message:"Product not found"})
//     }
//     if (productId.Quantity<quantity){
//         return res.status(400).json({message:"Product not found"})
//     }
//     productId.Quantity-=quantity
//     try{
//         await productId.save()
//         return res.status(200).json({message:"Order Placed"})
//     }catch(error){
//         return res.status(200).json({message:error})
//     }

    
// }
module.exports={createProduct,getallProduct,getProductByCategory,getProductsByName,getProductById, getProductByParentCategory}