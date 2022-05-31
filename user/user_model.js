const mongoose = require('mongoose');

const RegisterSchema = mongoose.Schema({
    createdAt:{
        type:String
    },
    firstName: String,
    lastName:String,
    email: String,
    phoneNumber: Number,
    password: String,
    newPassword:String,
    confirmPassword:String,
    DOB:String,
    active:{
        type:Boolean,
        default:false
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
}, {
    collection: 'register'
})
const otpSchema=mongoose.Schema({
    otp:Number,
    userDetails:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:false
    }
},{
    collection:'otp'
})

const register = mongoose.model('RegisterSchema', RegisterSchema);
const sendOtp=mongoose.model('otpSchema',otpSchema)

module.exports={register,sendOtp}