const jwt = require("jsonwebtoken");

const authMiddleware =
(req,res,next)=>{

try{

const token =req.cookies?.token;

console.log("COOKIE:",token);

if(!token){

req.user = null;

return res.status(401).json({message:"Login required"});

}

const decoded =jwt.verify(token,process.env.JWT_PRIVATE_KEY);

req.user = {id: decoded.id};

next();

}
catch(error){

req.user = null;

return res.status(401).json({message:"Invalid token"});

}

};

module.exports = authMiddleware;