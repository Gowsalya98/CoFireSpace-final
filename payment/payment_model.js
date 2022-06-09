const mongoose=require('mongoose')

const orderIdSchema=mongoose.Schema({
    createdAt:String,
    orderId:String

},{
    collection:'orderId'
})

const paymentSchema=mongoose.Schema({
    createdAt:String,
    orderId:String,
    accountHolderName:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    amount:Number,
    paymentOn:{
        type:String,
        default:'paid'
    },
    transactionStatus: {
        type: String,
        default: "Success"
    },
    bookingDetails:Object
},{
    collection:'payment'
}) 

const order=mongoose.model('orderIdSchema',orderIdSchema)
const payment=mongoose.model('paymentSchema',paymentSchema)

module.exports={order,payment}