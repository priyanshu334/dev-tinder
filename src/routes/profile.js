const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const {validateEditProfileData} = require("../utils/validation")


profileRouter.get("/profile/view",async(req,res)=>{
    try{
        const user = req.user;
        res.send(user)

    }catch(err){
        res.status(400).send(err.message)
    }
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
     try{
     if(!validateEditProfileData(req)){
        throw new Error("invalid data")
     }
     const user = req.user //loged in user 
     Object.keys(req.body).forEach((key)=>{user[key]=req.body[key]})
     await user.save();
     res.send(`${user.firstName} , Your profile is upadated sucessfully`)
     }catch(err){
        res.send(err.message)
     }
})

module.exports = profileRouter;