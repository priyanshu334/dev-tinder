const { JsonWebTokenError } = require('jsonwebtoken');
const User = require("../models/user")
const jwt = require('jsonwebtoken')

const userAuth =async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("token is not valid")
        }

    const decodedObj = await jwt.verify(token,"DEVTINDER")

    const {_id} = decodedObj;

    const user = await User.findById(_id);
    if(!user){
        throw new Error("user not found")
    }
    next();
    req.user = user;

    }catch(err){
        res.status(400).send(err.message)
    }
  
}

module.exports={
    userAuth,
}