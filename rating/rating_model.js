const mongoose=require('mongoose')

const ratingSchema=mongoose.Schema({
    userId:String,
    spaceId:String,
    rating:{
        type:Number,
        default:0
    },
    numOfPerson:{
        type:Number,
        default:0
    }
},{
    collection:'rating'
})

const rating=mongoose.model('ratingSchema',ratingSchema)

module.exports={rating}