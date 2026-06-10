const {createProduct,getallProduct,getProductsByName,getProductByCategory,getProductById, getProductByParentCategory}=require("../controllers/productController.js")
const express=require('express')

const router=express.Router()
const multer=require("multer")
const upload=multer({storage:multer.memoryStorage()})
router.use(express.json())
router.post("/createproduct",upload.single("image"),createProduct)
router.get("/getProduct",getallProduct)
router.get("/getproductsbyname/:name",getProductsByName)
router.get("/products/:id",getProductById)
router.get("/getbyParent/:id", getProductByParentCategory)
router.get("/getproductbycategory/:category",getProductByCategory)
module.exports=router