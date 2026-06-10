const {addToWishlist,getallWishlist,deletWishListItem}=require("../controllers/wishlistController.js")
const authmiddleware=require('../middleware/authmiddleware.js')
const express=require("express")
const router=express.Router()
router.use(express.json())
router.post('/addtowishlist',authmiddleware,addToWishlist)
router.get('/getallwishlist',authmiddleware,getallWishlist)
router.delete('/deletwishlistitem/:id',authmiddleware,deletWishListItem)
module.exports=router