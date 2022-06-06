const mongoose=require('mongoose')
const {booking}=require('./booking_model')
const moment=require('moment')
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')

const hostGetOurSpaceBookingHistory=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
            if(token!=null){
                console.log('line 10',token.id)
            const data=await booking.aggregate([{$match:{$and:[{"spaceDetails.HostId":token.id},{deleteFlag:false}]}}])
            if(data){
                console.log('line 13',data)
                data.sort().reverse()
                res.status(200).send({success:'true',message:'your space booking data',data:data})
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
const HostAcceptUserBooking=async(req,res)=>{
    try{
        const data=await booking.findOne({_id:req.params.bookingId,deleteFlag:false})
        console.log('line 11',data)
        if(data){
            console.log('line 13',data.userDetails.email)
            postMail(data.userDetails.email,"Booking Confirmation","congratulations...!,your booking is accepted")
            const datas=await booking.findOneAndUpdate({_id:req.params.bookingId},{$set:{bookingStatus:"acceptBooking","spaceDetails.spaceBookingStatus":"booked"}},{new:true})
            if(datas){
                console.log('line 17',datas)
                res.status(200).send({message:"successfully host accept your space",datas})
            }else{
                res.status(400).send({message:"failed",data:[]})
            }
        }else{
            res.status(302).send({message:'invalid id'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}

const HostRejectUserBooking=async(req,res)=>{
    try{
        const data=await booking.findOne({_id:req.params.bookingId,deleteFlag:false})
        console.log('line 30',data)
        if(data){
            console.log('line 32',data.userDetails.email)
            postMail(data.userDetails.email,"Your Request Not Accept","oops...!,your booking is not accepted")
            const datas=await booking.findOneAndUpdate({_id:req.params.bookingId},{$set:{bookingStatus:"rejectBooking","spaceDetails.spaceBookingStatus":"availableSpace"}},{new:true})
            if(datas){
                console.log('line 36',datas)
                res.status(200).send({message:"host reject your booking",datas})
            }else{
                res.status(400).send({message:"failed",data:[]})
            }
        }else{
            res.status(302).send({message:'invalid id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nishagowsalya339@gmail.com',
        pass: '8760167075'
    }
})
const postMail = function (to, subject, text) {
    return transport.sendMail({
        from: 'nishagowsalya339@gmail.com',
        to: to,
        subject: subject,
        text: text,
    })
}

const getAllAcceptUserBooking=async(req,res)=>{
    try{
        const data=await booking.aggregate([{$match:{$and:[{bookingStatus:"acceptBooking"},{"spaceDetails.spaceBookingStatus":"booked"},{deleteFlag:false}]}}])
        if(data){
            data.sort().reverse()
            res.status(200).send({message:'All Accept Booking list',data:data})
        }else{
            res.status(302).send({message:'data is empty',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAllRejectUserBooking=async(req,res)=>{
    try{
        const data=await booking.aggregate([{$match:{$and:[{bookingStatus:"rejectBooking"},{"spaceDetails.spaceBookingStatus":"availableSpace"},{deleteFlag:false}]}}])
        if(data){
            data.sort().reverse()
            res.status(200).send({message:'All reject Booking list',data:data})
        }else{
            res.status(302).send({message:'data is empty',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const pastBookingDetails=async(req,res)=>{
    try{
        const hostToken=jwt.decode(req.headers.authorization)
        if(hostToken!=null){
        const data=await booking.aggregate([{$match:{$and:[{"spaceDetails.HostId":hostToken.id},{deleteFlag:false}]}}])
           if(data){
               console.log('line 156',data)
               const currantDate=moment(new Date()).toISOString().slice(0,10)
               console.log('currentDate:',currantDate)
               var arr=[]
               data.map((result)=>{
                   if(currantDate>result.eventFromDate){
                       arr.push(result)
                   }
               })
            //    for(i=0;i<data.length;i++){
            //       if(currantDate>data[i].eventFromDate){
            //           console.log('line 100',data)
            //            arr.push(data[i])    
            //            res.status(302).send({message:'user does not book in any place..!'})
            //         }
                //  }
               console.log('.....',arr)
              res.status(200).send({success:'true',message:'past booking details',arr})
           }else{
               res.status(302).send({success:'false',message:'failed'})
           }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})   
        }
        }catch(err){
            console.log(err)
           res.status(500).send({message:'internal server error'})
        }
}
const upcomingBookingDetails=async(req,res)=>{
    try{
        const hostToken=jwt.decode(req.headers.authorization)
        if(hostToken!=null){
            const data=await booking.aggregate([{$match:{$and:[{"spaceDetails.HostId":hostToken.id},{deleteFlag:false}]}}])
            if(data){
                const currentDate=moment(new Date()).toISOString().slice(0,10)
                var arr=[]
                data.map((result)=>{
                    if(currentDate<result.eventFromDate){
                        arr.push(result)
                    }
                })
                console.log('.....',arr)
                res.status(200).send({success:'true',message:'upcoming booking details',arr})
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
const pendingBookingDetails=async(req,res)=>{
    try{
        const hostToken=jwt.decode(req.headers.authorization)
        if(hostToken!=null){
            const data=await booking.aggregate([{$match:{$and:[{"spaceDetails.spaceBookingStatus":'booking waiting'},{"spaceDetails.HostId":hostToken.id},{deleteFlag:false}]}}])
                if(data){
                    data.sort().reverse()
                    res.status(200).send({success:'true',message:'pending booking details',data:data})
                }else{
                    res.status(302).send({success:'false',message:'data not found'}) 
                }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'}) 
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const confirmedBooking=async(req,res)=>{
    try{
        const hostToken=jwt.decode(req.headers.authorization)
        if(hostToken!=null){
            const data=await booking.aggregate([{$match:{$and:[{"spaceDetails.spaceBookingStatus":'booked'},{"spaceDetails.HostId":hostToken.id},{deleteFlag:false}]}}])
                if(data){
                    data.sort().reverse()
                    res.status(200).send({success:'true',message:'confirm booking details',data:data})
                }else{
                    res.status(302).send({success:'false',message:'data not found'}) 
                }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'}) 
        }  
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    HostAcceptUserBooking,
    HostRejectUserBooking,
    hostGetOurSpaceBookingHistory,
    getAllAcceptUserBooking,
    getAllRejectUserBooking,
    pastBookingDetails,
    upcomingBookingDetails,
    pendingBookingDetails,
    confirmedBooking
}