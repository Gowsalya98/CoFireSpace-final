const mongoose=require('mongoose')

const spaceAddForHost=mongoose.Schema({
    createdAt:String,
    HostId:String,
    HostDetails:Object,
    categoryName:String,
    spaceBuildYear:String,
    spaceSqFt:String,
    garageSize:Number,
    garages:Number,
    bathrooms:Number,
    bedrooms:Number,
    contact:Number,
    address:String,
    city:String,
    country:String,
    pincode:String,
    currency:String,
    desc:String,
    numOfPersonFitInRoom:Number,
    parkingSpace:String,
    spaceTime:String,
    price:Number,
    rating:{type:Number,default:0},
    amenities:[String],
    multipleSpaceImage:[String],
    spaceImage:[String],
    userIpAddress:[String],
    ipAddressCount:{
        type:Number,
        default:0
    },
    review:[],
    //noOfDays:Number,
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

const spaceImageSchema=mongoose.Schema({
    image:[String],
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:String
    },{
        collection:"spaceImage"
})

const spaceImage=mongoose.model('spaceImageSchema',spaceImageSchema)

const spaceDetails=mongoose.model('spaceAddForHost',spaceAddForHost)

module.exports={spaceDetails,spaceImage}