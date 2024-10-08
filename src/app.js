const express = require('express')

const app = express()




connectDB.then(()=>{
    console.log("connection established")
    app.listen(7777 , ()=>{
        console.log("server listning at port ")
    })
}).catch((err)=>{
    console.log(err.message);
})

