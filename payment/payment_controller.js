const jwt=require('jsonwebtoken')
const moment=require('moment')
const razorpay=require('razorpay')
const mongoose=require('mongoose')
const {booking}=require('../Booking/booking_model')
const {payment,order}=require('./payment_model')

const createOrderId=(req,res)=>{
    try{
        var instance=new razorpay({
            key_id: 'rzp_test_GUxQPzcyYr9u9P', 
            key_secret: 'L33CkDSL2wI8qOHhIQRnZOoF' 
        })
        var options={
            amount:100,
            currency:"INR",
            receipt:"order_rcptid_11"
        }
        instance.orders.create(options,(err,datas)=>{
            if(err){
                res.status(400).send({success:'false',message:'failed'})
            }else{
                req.body.orderId=datas.id
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                order.create(req.body,(err,data)=>{
                    if(err){
                        res.status(400).send({success:'false',message:'failed'})
                    }else{
                        res.status(200).send({success:'true',message:'successfully generated orderId',data})
                    }
                })
            }

        })
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const createPayment=async(req,res)=>{
    try{
       if(req.params.bookingId.length=24){
            req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
            const datas=await booking.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.bookingId)},{deleteFlag:false}]}}])
                if(datas!=null){
                    req.body.bookingDetails=datas
                    const data=await payment.create(req.body)
                        if(data!=null){
                            res.status(200).send({success:'true',message:'payment successfull',data})
                        }else{
                            res.status(302).send({success:'false',message:'failed to payment'})
                        }
                }else{
                    res.status(302).send({success:'false',message:'data not found'})
                }
        }else{
            res.status(302).send({success:'false',message:'invalid id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAll=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            payment.find({},(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'data not found'})
                }else{
                    data.sort().reverse()
                    res.status(200).send({success:'true',message:'All payment details',data:data})
                }
            })
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const getById=async(req,res)=>{
    try{
        if(req.params.paymentId.length==24){
            const data=await payment.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.paymentId)}}])
                if(data!=null){
                    res.status(200).send({success:'true',message:'your payment details',data:data})
                }else{
                    res.status(400).send({success:'false',message:'failed',data:[]}) 
                }
        }else{
            res.status(302).send({success:'false',message:'invalid id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    createOrderId,
    createPayment,
    getAll,
    getById
}