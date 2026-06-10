const {createContact,getContact,deleteContact}=require("../controllers/contactController.js")
const authmiddleware=require('../middleware/authmiddleware.js')
const express=require("express")
const router=express.Router()
router.post("/createcontact",authmiddleware,createContact)
router.get("/getcontact",authmiddleware,getContact)
router.delete("/deletecontact/:id",deleteContact)
module.exports=router