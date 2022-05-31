const mongoose=require('mongoose')

const bookingSchema=mongoose.Schema({
    createdAt:String,
    userId:String,
    spaceId:String,
    eventFromDate:String,
    eventToDate:String,
    startTime:String,
    endtime:String,
    bookingStatus:{
        type:String,
        default:'waiting'
    },
    userDetails:{
        type:Object
    },
    spaceDetails:{
        type:Object
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'bookingDetails'
})

const booking=mongoose.model('bookingSchema',bookingSchema)

module.exports={booking}