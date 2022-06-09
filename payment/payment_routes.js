const router=require('express').Router()

const paymentControl=require('./payment_controller')

router.post('/create-orderId',paymentControl.createOrderId)

router.post('/payment/:bookingId',paymentControl.createPayment)

router.get('/getAllPayment',paymentControl.getAll)

router.get('/getById-payment/:paymentId',paymentControl.getById)

module.exports=router