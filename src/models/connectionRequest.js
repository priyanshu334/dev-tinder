const mongoose = require("mongoose")

const connectionRequest = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"]
            ,message:`{VALUE is incorrect status type`
        },
        required:true
    }
},{
    timestamps:true,
})
connectionRequest.index({fromUserId:1,toUserId:1})
connectionRequest.pre("save",function(next){
    const connectionRequest = this;
    //check if the fromUserIf is same as toUserID
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request")

    }
    next();
})

const ConnectionRequest = new mongoose.model("connection request",connectionRequest)
module.exports=ConnectionRequest;