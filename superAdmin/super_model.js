const mongoose = require('mongoose');

const superAdminSchema = mongoose.Schema({
    createdAt:{
        type:String
    },
    username : String,
    contact : Number,
    email : String,
    password: String,
    role: {
        type: String, 
        default: "subadmin"
    },
    permission:String,
    adminId: String,
    deleteFlag:{
        type:Boolean,
        default:false
    }
}, {
    collection: 'superAdmin'
})

const superAdmin = mongoose.model('superAdminSchema', superAdminSchema)

module.exports={superAdmin}