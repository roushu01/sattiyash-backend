const express=require('express')

const {addToCart,DeleteFromCart,updateCart, getCartItems}=require('../controllers/cartController.js')
const router=express.Router()
const authmiddleware=require('../middleware/authmiddleware.js')
router.use(express.json())
router.post('/addtocart',authmiddleware,addToCart)
router.delete('/deletefromcart/:id',authmiddleware,DeleteFromCart)
router.put('/updatecart',authmiddleware,updateCart)
router.get('/getcartitems',authmiddleware,getCartItems)
module.exports=router