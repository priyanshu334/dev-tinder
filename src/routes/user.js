const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router()
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
userRouter.get("/user/requests/recived",userAuth,async(req,res)=>{

    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"accepted"
        }) .populate("fromUserId",["firstname","lastName"])
        res.json({
            message:"all the connection requests",
            connectionRequest:connectionRequest
        })

    }catch(err){
        res.status(400).send(err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
        const data = connectionRequests.map( (row)=>{
            if(row.fromUserId.toString() ===loggedInUser._id.toString()){
                return row.toUserId;
        }
        return row.fromUserId,
        })
        res.json({data:connectionRequests})
    }catch(err){
        res.status(400).send({message:err.message})
    }
})
userRouter.get("/feed" ,userAuth, async(req,res)=>{
    try{
        //user should see all the user cards except
        //0 his own card
        // his connections
        // ignored people
        // already sent the connection request 
        const loggedInUser = req.user 
        const page = parseInt(req.query.page)||1;
        let limit =  parseInt(req.query.limit)||10;
        limit = limit>50 ?50:limit
        const skip = (page-1)*limit ;
        const connectionRequests = await ConnectionRequest.finc({
            $or:[{
                fromUserId:loggedInUser._id
            },{toUserId:loggedInUser._id}]
        }).select("fromUseId","toUserId")
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId)
            hideUsersFromFeed.add(req.toUserId)
        })

        const users = await User.find({
           $and:[ {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
           ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        
    res.send(connectionRequests)    
    }catch(err){
        res.status(400).send({message:err.message})
    }
})


module.exports = userRouter