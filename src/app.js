const express = require('express')
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
app.use(express.json())//converts everting to jsnon it's amiddleware 
app.post("/signup", async (req ,res)=>{
//  const user  = new User({
//     firstName:"Akshay",
//     lastName:"saini",
//     emialId:"akshay@gmail.com",
//     password:"76sebhbhs"
//  })//)creating the new instance of user model 

const user = new User(req.body)
 try{
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

connectDB.then(()=>{
    console.log("connection established")
    app.listen(7777 , ()=>{
        console.log("server listning at port ")
    })
}).catch((err)=>{
    console.log(err.message);
})

