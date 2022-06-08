const mongoose=require('mongoose')

const paymentSchema=mongoose.Schema({
    createdAt:String,
    orderId:String

},{
    collection:'paymentDetails'
})

const payment=mongoose.model('paymentSchema',paymentSchema)

module.exports={payment}