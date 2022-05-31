
const mongoose=require('mongoose')
const Schema = mongoose.Schema;


const amenitiesSchema=new Schema({

    createdAt:{
        type:String
    },
   amenitiesName:String,
   amenitiesImage:String,
   desc:String,
   adminId:String,
    deleteFlag:{
        type:Boolean,
        default:false
    }

},{
    collection: 'amenities'
})

// const amenitiesSchema=new Schema({
//     AmenitiesDetails:[ameniSchema],
//     adminId:String
// },{
//     collection: 'amenities'})


const  amenities= mongoose.model('amenitiesSchema',amenitiesSchema )

module.exports = {amenities}