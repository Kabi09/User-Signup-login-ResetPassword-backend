const express=require("express")
const { RegisterUser,LoginUser,Demo,LogoutUser,ForgotPasswordOTP,VerifyOtpAndResetPassword} = require("../controller/userController")
const {isAuthenticatedUser}=require("../middleware/authenticate")

const router=express.Router()

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/logout").get(isAuthenticatedUser,LogoutUser)
router.route("/password/forget/otp").post(ForgotPasswordOTP)
router.route("/password/resetpassword").put(VerifyOtpAndResetPassword)
router.route("/demo").get(isAuthenticatedUser,Demo)

module.exports=router;