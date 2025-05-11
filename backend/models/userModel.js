const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Valid Email id"]

    },
    phone:{
        type:Number,
        required:[true,"Please Enter Password"],
       validate: {
        validator: function (v) {
            return /^\d{10}$/.test(v); // Regex: exactly 10 digits
        },
        message: "Phone number must be exactly 10 digits"
    }

    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minlength:[8,"minimum length of Password:8"],
        maxlength:[15,"maximum length of Password:15"],
        select:false
    },
    avator:{
        type:String,
    },
    role:{
        type:String,
        default:"user"
    },
    otp: {
        type: String,
    },
    otpExpire: {
        type: Date,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    if (!this.password) {
        return next(new Error("Password is required to hash."));
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_TIME

    })
}


userSchema.methods.isValidPassword=async function(EnteredPassword){
    return await bcrypt.compare(EnteredPassword,this.password)

}

userSchema.methods.generateOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    this.otp = otp;
    this.otpExpire = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
    return otp;
};

let Usermodel=mongoose.model("User",userSchema)

module.exports=Usermodel