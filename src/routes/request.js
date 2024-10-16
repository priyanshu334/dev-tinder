const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const requestesRouter = express.Router()
import { userAuth } from '../middlewares/auth';
const User = require("../models/user")


requestesRouter.post("/request/send/status/:toUserId",userAuth , async(req,res)=>{
try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status =req.params.status
    const allowedStatus =["ignored","interested"]
    if(!allowedStatus.includes(status)){
           return res.status(400).json({
            message:"Invalid status type"
           })
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,
                toUserId,},
                {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if(existingConnectionRequest){
        return res.status(400).send({message:"connection request already exist "})
    }
    const toUser = await User.findById(toUserId);
    if(!toUser){
        return res.status(400).send({message:"user not found"})
    }
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    })
    const data = await connectionRequest.save();
    res.json({
        message:"Connection Request sent successfully",
        data:data
    }) 


}catch(err){
    res.status(400).send(err.message)
}
})

requestesRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    
    try{
        const loggedInUser = req.user;
        const {status,requestId} = req.params
        const allowedStatus =["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not allowed"})
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        
    }catch(err){
        res.status(400).send("ERROR"+err.message)

    }
})



module.exports = requestesRouter;