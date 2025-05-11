const UserModel=require("../models/userModel")
const SendEmail = require("../utils/email")


// User register-   --api/register
exports.RegisterUser=async (req,res)=>{
    const {name,email,phone,password,avator}=req.body
    const User=await UserModel.create({
        name,
        email,
        phone,
        password,
        avator
    })

    const token=User.getJwtToken()

    res.status(201).json({
        success:true,
        User,
        token
    })
}

// User Login-   --api/login
exports.LoginUser=async(req,res)=>{
    const {email,phone,password}=req.body

    if((!email && !phone) || !password){
        res.status(400).json({
            success:false,
            message:" Please Enter (email or phone) and password"
        })

    }

    let user;
    if (email) {
        user = await UserModel.findOne({ email }).select("+password");
    } else {
        user = await UserModel.findOne({ phone }).select("+password");
    }
    
    if(!user){
        res.status(401).json({
            success:false,
            message:"Invalid email,phone or password"
        })
    }

    if(!await user.isValidPassword(password)){
        res.status(401).json({
            success:false,
            message:"Invalid email,phone or password"
        })
    }

    const token=user.getJwtToken()
    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME *24*60*60*1000),
        httpOnly:true,
    }
    res.status(201).cookie('token',token,options).json({
        success:true,
        user,
        token
    })

}


//--login user only to acess sample       --api/demo   
exports.Demo=(req,res)=>{

    res.status(200).json({
            success:true,
            message:"hello world"
        })
}


// logout user    --api/logout
exports.LogoutUser=(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    }).status(200).json({
        success:true,
        message:"Logout Successfully"
    })


}

//ForgetPassword Otp send    --api/password/forget/otp
exports.ForgotPasswordOTP = async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    const otp = user.generateOtp();
    await user.save({ validateBeforeSave: false });

    const message = `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nThank you!`;

    try {
        await SendEmail({
            email: user.email,
            subject: "Password Reset OTP",
            message: message
        });

        res.status(200).json({
            success: true,
            message: `OTP sent to ${user.email}`,
            otp:otp
        });
    } catch (error) {
        console.error(error);
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP email"
        });
    }
};

//Resetpassword Update   --api/password/resetpassword
exports.VerifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() } // check if OTP is still valid
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or expired OTP"
        });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password has been reset successfully"
    });
};

