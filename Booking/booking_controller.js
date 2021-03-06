const mongoose=require('mongoose')
const {register}=require('../user/user_model')
const {spaceDetails}=require('../addSpace/space_model')
const {booking}=require('./booking_model')
const jwt=require('jsonwebtoken')
const moment=require('moment')

const userReserveToSpace=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
            const datas=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(token.id)},{deleteFlag:false}]}}])
            if(datas){
                req.body.userId=datas[0]._id
                req.body.userDetails=datas[0]
                         const result1=await spaceDetails.findOne({_id:req.params.spaceId,deleteFlag:false})
                     if(result1){
                            req.body.spaceId=result1._id
                            req.body.spaceDetails=result1
                             req.body.spaceDetails.spaceBookingStatus="booking waiting"
                        const result=await spaceDetails.findOneAndUpdate({_id:req.params.spaceId},req.body,{new:true})
                        if(result){
                            req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                                const data=await booking.create(req.body)
                                if(data){
                                    res.status(200).send({success:'true',message:'booking successfull',data:data})
                                }else{
                                    res.status(200).send({success:'false',message:'failed',data:[]})
                                 }
                        }else{
                            res.status(302).send({success:'false',message:'failed to data try again'})
                         }
                    }else{
                            res.status(302).send({success:'false',message:'invalid id',data:[]})
                        }
            }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
        }else{
        res.status(302).send({message:'invalid token'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}

const userGetOurBookingHistory=async(req,res)=>{
    try{
            const token=jwt.decode(req.headers.authorization)
            if(token!=null){
                console.log('line 51',token.id)
            const data=await booking.aggregate([{$match:{$and:[{"userId":token.id},{deleteFlag:false}]}}])
            if(data){
                console.log('line 54',data)
                data.sort().reverse()
                res.status(200).send({success:'true',message:'your booking history',data:data})
            }else{
                res.status(400).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'invalid token'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const currentBookingDetails=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            console.log('...',userToken.id)
        const today=moment(new Date()).toISOString().slice(0,10)
        const data=await booking.aggregate([{$match:{$and:[{createdAt:today},{"userId":userToken.id},{deleteFlag:false}]}}])
            if(data){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'current booking details',data})
            }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})  
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const pastBookingDetails=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            const data=await booking.aggregate([{$match:{$and:[{"userId":userToken.id},{deleteFlag:false}]}}])
            if(data){
                const currentDate=moment(new Date()).toISOString().slice(0,10)
                var arr=[]
                data.map((result)=>{
                    if(currentDate>result.eventFromDate){
                        arr.push(result)
                    }
                })
                console.log('.....',arr)
                res.status(200).send({success:'true',message:' user past booking details',arr})
            }else{
                res.status(302).send({success:'false',message:'failed'}) 
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})  
        }
    }catch(err){
        res.status(500).send({message:'internal server error'}) 
    }
}
const getAllBooking=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
            const data=await booking.aggregate([{$match:{deleteFlag:false}}])
            if(data){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'Booking history',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'invalid token'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const TotalReserve=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await booking.aggregate([{$match:{deleteFlag:false}}])
            if(data.length!=0){
                const count=data.length
                res.status(200).send({success:'true',message:'Total Reserve',count})
            }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const NewReserve=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const today=moment(new Date()).toISOString().slice(0,10)
            const data=await booking.aggregate([{$match:{$and:[{createdAt:today},{deleteFlag:false}]}}])
            if(data.length!=0){
                const count=data.length
                res.status(200).send({success:'true',message:'New Reserve',count})
            }else{
                res.status(400).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getById=async(req,res)=>{
    try{
        if(req.params.bookingId.length==24){
            const data=await booking.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.bookingId)},{"deleteFlag":false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data' ,data: data[0] });
            } else {
              res.status(302).send({success:'false',message:'failed', data: [] });
            }
          } else {
            res.status(400).send({ message: "please provide a valid id" });
          }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

module.exports={
    userReserveToSpace,
    userGetOurBookingHistory,
    currentBookingDetails,
    pastBookingDetails,
    getAllBooking,
    TotalReserve,
    NewReserve,
    getById
}