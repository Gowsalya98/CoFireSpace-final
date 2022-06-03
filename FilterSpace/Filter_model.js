const mongoose=require('mongoose')

const filterSchema=mongoose.Schema({
    createdAt:String,
    spaceId:String,
    userIpAddress:String,
    deleteFlag:{
        type:Object,
        default:false
    }
},{
    collection:'filterSchema'
})

const filter=mongoose.model('filterSchema',filterSchema)

module.exports={filter}


