const mongoose=require('mongoose')

const spaceAddForHost=mongoose.Schema({
    createdAt:String,
    HostId:String,
    HostDetails:Object,
    categoryName:String,
    contact:Number,
    address:String,
    city:String,
    pincode:String,
    spaceSqFt:String,
    numOfPersonFitInRoom:Number,
    amenities:[String],
    category:String,
    spaceImage:[String],
    userIpAddress:[String],
    ipAddressCount:{
        type:Number,
        default:0
    },
    //noOfDays:Number,
    spaceTime:String,
    price:Number,
    spaceBookingStatus:{
        type:String,
        default:'availableSpace'
    },
    status:{
        type:String,
        default:'pending'
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
})

const spaceDetails=mongoose.model('spaceAddForHost',spaceAddForHost)

module.exports={spaceDetails}