const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const spaceTypeAddForSuperAdmin = new Schema({
    createdAt:{
        type:String
    },
   spaceName:String,
   spaceImage:String,
   superAdminId:String,
   status:String,
    deleteFlag:{
        type:Boolean,
        default:false
    }
}, {
    collection: "category"
        
})

const ImageSchema=mongoose.Schema({
    image:String,
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:String
    },{
        collection:"ImageSchema"
})


const spaceType= mongoose.model('spaceTypeAddForSuperAdmin', spaceTypeAddForSuperAdmin)
const image=mongoose.model('ImageSchema',ImageSchema)

module.exports={spaceType,image}
