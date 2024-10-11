const express = require('express')
const connectDB = require("./config/database")
const app = express()


const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestesRouter = require("./routes/request")

app.use(express.json())

//converts everting to jsnon it's amiddleware 
app.use(cookieParser)

app.use("/",authRouter);
app.use("/",profileRouter)
app.use("/",requestesRouter);
app.use("/",userRouter)



connectDB.then(()=>{
    console.log("connection established")
    app.listen(7777 , ()=>{
        console.log("server listning at port ")
    })
}).catch((err)=>{
    console.log(err.message);
})

