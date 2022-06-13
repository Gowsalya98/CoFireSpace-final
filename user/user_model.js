const mongoose = require('mongoose');
const { stringify } = require('querystring');

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
    about:{type:String,default:''},
    address:{type:String,default:''},
    agencyName:{type:String,default:''},
    city:{type:String,default:''},
    country:{type:String,default:''},
    facbookId:{type:String,default:''},
    linkedinId:{type:String,default:''},
    skypeId:{type:String,default:''},
    twitterId:{type:String,default:''},
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