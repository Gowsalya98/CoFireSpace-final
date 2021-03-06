const mongoose=require('mongoose')

const reportSchema=mongoose.Schema({
    createdAt:String,
    quotes:String,
    description:String,
    spaceDetails:Object,
    userDetails:Object,
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'report'
})

const reviewSchema=mongoose.Schema({
    createdAt:String,
    quotes:String,
    description:String,
    spaceId:String,
    userId:String,
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'review' 
})

const report=mongoose.model('reportSchema',reportSchema)

const review=mongoose.model('reviewSchema',reviewSchema)

module.exports={report,review}