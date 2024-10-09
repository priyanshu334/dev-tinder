const express = require('express')
const connectDB = require("./config/database")
const app = express()
const {validateSignUpData} = require("./utils/validation")
const User = require("./models/user")
const bcrypt = require("bcrypt")
app.use(express.json())//converts everting to jsnon it's amiddleware 



app.post("/signup", async (req ,res)=>{
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
app.get('/user',async (req,res)=>{
    const email = req.body.emailId;

    try{
     const users =   await    User.find({emailId:email});

     if(users.length===0){
        res.status(404).send("user not found")
     }else{
        res.send(users)
     }
     

    }catch(err){
        res.status(400).send("cannot find the user")
    }



})
app.post("/login", async(req,res)=>{
    try{
     
        const {emailId,password}=req.body;
        const user = await User.findOne({emialId:emailId});
        if(!user){
            throw new Error("Email id is not present in Db")
        }
        const isPasswordValid = bcrypt.compare(password ,user.password)
        if(isPasswordValid){
            res.send("Login sucessfull")
        }else{
            throw new Error("incoorect password")
        }
    }catch(err){
        res.status(400).send(err.message);
    }

})
app.get("/feed",async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users)
    }catch(err){
        res.status(404).send("opps")
    }
})
app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params.userId;
    const data = req.body;
    
    try{
     
    const ALLOWED_UPDDATEs=[
        "photoUrl","about","gender","age"
    ]
    const isUpdateAllowed = Object.keys((data).every((k)=>ALLOWED_UPDDATEs.includes(k)))
    if(!isUpdateAllowed){
        throw new Error("update not allowed")
    }
    if(data?.skills.length>10){
        throw new Error("skills cannot be more than 10")
    }
        await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
        });
        res.send("user updated sucesfully")
    }catch(err){
        res.status(400).send("something went wrong")
    }
})
app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
       res.send("user deleted sucessully        ")

    }catch(err){
        res.status(400).send("something went wrong");
    }
})
connectDB.then(()=>{
    console.log("connection established")
    app.listen(7777 , ()=>{
        console.log("server listning at port ")
    })
}).catch((err)=>{
    console.log(err.message);
})

