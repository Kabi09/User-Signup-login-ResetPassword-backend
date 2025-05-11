const express=require("express")
const { RegisterUser,LoginUser,getUserProfile,LogoutUser,ForgotPasswordOTP,VerifyOtpAndResetPassword,Changepassword} = require("../controller/userController")
const {isAuthenticatedUser}=require("../middleware/authenticate")

const router=express.Router()

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/logout").get(isAuthenticatedUser,LogoutUser)
router.route("/password/forget/otp").post(ForgotPasswordOTP)
router.route("/password/resetpassword").put(VerifyOtpAndResetPassword)
router.route("/password/change").put(isAuthenticatedUser,Changepassword)
router.route("/user").get(isAuthenticatedUser,getUserProfile)

module.exports=router;
