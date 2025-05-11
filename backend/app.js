const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const path=require("path")
const cookieParser=require("cookie-parser")
const UserRouer=require("./Routes/userRoutes")

const app=express()
app.use(express.json())
app.use(cookieParser())


app.use("/api",UserRouer)

dotenv.config({ path: path.resolve(__dirname, "./config/.env") });


mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("DB Connected"); 
})
.catch(()=>{
    console.log("DB Not connected");
    
})

app.listen(process.env.PORT,()=>{
    console.log("server is running");
    
})