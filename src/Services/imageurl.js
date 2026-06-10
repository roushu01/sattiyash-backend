const {ImageKit}=require("@imagekit/nodejs")
const imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_Private_KEY
})
async function uploadFile(buffer){
    try{
      const result=await imagekit.files.upload({
        file:buffer.toString("base64"),
        fileName:`image-${Date.now()}.jpg`
    })
    return result  
    }catch(error){
        console.error(error)
    }
    
}
module.exports=uploadFile