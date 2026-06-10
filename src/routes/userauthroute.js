const express=require('express');
const {registeruser,authenticateUser,logoutUser ,addAddress,getalluser,deleteUser,deleteAddress,getReferralInfo,getReferralCode}=require('../controllers/userController.js')
const {addToCart}=require('../controllers/cartController.js')
const authMiddleware=require('../middleware/authmiddleware.js')
const router=express.Router();
router.use(express.json())
router.post('/register',registeruser)
router.post('/login',authenticateUser)
router.post('/address',addAddress)
router.get('/getuser',getalluser)
router.delete('/deleteuser/:id',deleteUser)
router.delete('/deleteaddress/:id',deleteAddress)
router.get(
  "/referral-info",
  authMiddleware,
  getReferralInfo
);
router.get(
  "/referral-code",
  authMiddleware,
  getReferralCode
);
router.post("/logout", logoutUser);
module.exports=router