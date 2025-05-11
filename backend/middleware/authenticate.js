const jwt=require("jsonwebtoken")
const UserModel=require("../models/userModel")
exports.isAuthenticatedUser=async (req,res,next)=>{
    const {token}=req.cookies

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Login First!!"
        })
    }

    const decode=jwt.verify(token,process.env.JWT_SECRET)

    req.user= await UserModel.findById(decode.id)

    next();

}