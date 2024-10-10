const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        requied:true,
        minLength:4,
        maxLength:50
    },
    lastName:
    {
        type:String,

    }
    ,emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid Email id ")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("invalid Email id ")
            }
        }
        
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{

        type:String,
        validate(value){
            if(!["male","female","others"].includes(values)){
                throw new Error("Gender Valid")
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid Email id ")
            }
        }
    },
    about:{
        type:String,
        default:"this is a default about of the user"
    },
    Skills:{
        type:[String],
    }
},{
    timestamps:true,
})
userSchema.methods.getJWT= async function (){
    const user = this; 
    const token = await jwt.sign({_id:user._id},"DEV@tinder",{
        expiresIn:"7d"
    })
    return token
}

const userModel=  mongoose.model("User",userSchema)

module.exports = userModel;