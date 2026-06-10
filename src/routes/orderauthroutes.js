const express=require('express')
const authmiddleware=require('../middleware/authmiddleware.js')
const {OrderPlaced,getOrder,updateOrderStatus,updateOrderQuanttiy}=require("../controllers/orderController.js")
const router=express.Router()
router.post('/order',authmiddleware,OrderPlaced)
router.get('/getorder',authmiddleware,getOrder)
router.put('/updateorderstatus',updateOrderStatus)
router.put('/updateorderquantity',updateOrderQuanttiy)
module.exports=router