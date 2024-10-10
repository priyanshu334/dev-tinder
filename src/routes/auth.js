const express = require('express')
const {validateSignUpData} = require("../utils/validation")
const authRouter = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")


authRouter.post("/signup", async (req ,res)=>{
    //validatop of ddata
    
    
    //encrypt the password
    
    
     try{
        validateSignUpData(req);
        const {firstName,lastName,emailId,password} = req.body;
    
        const passwordHash = bcrypt.hash(password,10)
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        })
        
        await user.save();
        res.send("user added sucessfully")
    
     }catch(err){
        res.status(400).send("error saving the user")
     }
    
    
    })


    authRouter.post("/login", async(req,res)=>{
        try{
         
            const {emailId,password}=req.body;
            const user = await User.findOne({emialId:emailId});
            if(!user){
                throw new Error("Email id is not present in Db")
            }
            const isPasswordValid = bcrypt.compare(password ,user.password)
            if(isPasswordValid){
                const token = await jwt.sign({_id:user._id},"DEV@Tinder789")
                res.cookie("token","nssehsnfshnfh")
                res.send("Login sucessfull")
            }else{
                throw new Error("incoorect password")
            }
        }catch(err){
            res.status(400).send(err.message);
        }
    
    })
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("logout Sucessful")
})

    

module.exports = authRouter;