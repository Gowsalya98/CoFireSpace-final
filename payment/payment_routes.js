const router=require('express').Router()
const paymentControl=require('./payment_controller')

router.post('/',paymentControl.createOrderId)

module.exports=router