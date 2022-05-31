const {spaceDetails}=require('../addSpace/space_model')
const {validationResult}=require('express-validator')
const jwt =require('jsonwebtoken')
const nodemailer=require('nodemailer')

const getAll=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
       const data=await spaceDetails.aggregate([{$match:{deleteFlag:false}}])
       if(data){
           console.log('line 11',data)
            data.sort().reverse()
            res.status(200).send({Success:'true',message:'All space details',data})
       }else{
        res.status(400).send({success:'false',message:'failed',data:[]})
       }
    }else{
        res.status(400).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const adminAcceptSpaceDetails=async(req,res)=>{
    try{
        const data=await spaceDetails.findOne({_id:req.params.spaceId,deleteFlag:false})
        console.log('line 11',data)
        if(data){
            console.log('line 31',data.HostDetails.email)
            postMail(data.HostDetails.email,"space details confirmation","congratulations...!,Your space details is Accept")
            const datas=await spaceDetails.findOneAndUpdate({_id:req.params.spaceId},{status:"accept"},{new:true})
            if(datas){
                console.log('line 35',datas)
                res.status(200).send({message:"successfully accept space details",datas})
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
const adminRejectSpaceDetails=async(req,res)=>{
    try{
        const data=await spaceDetails.findOne({_id:req.params.spaceId,deleteFlag:false})
        console.log('line 51',data)
        if(data){
            console.log('line 53',data.HostDetails.email)
            postMail(data.HostDetails.email,"space details confirmation","oops...!,Your space details not accept")
            const datas=await spaceDetails.findOneAndUpdate({_id:req.params.spaceId},{status:"reject"},{new:true})
            if(datas){
                console.log('line 57',datas)
                res.status(200).send({message:"Reject Space",datas})
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

const getAllRejectSpaceList=async(req,res)=>{
    try{
        const data=await spaceDetails.aggregate([{$match:{$and:[{"status":"reject"},{deleteFlag:false}]}}])
        if(data){
            data.sort().reverse()
            res.status(200).send({message:'All reject space list',data:data})
        }else{
            res.status(302).send({message:'data is empty',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    getAll,
    adminAcceptSpaceDetails,
    adminRejectSpaceDetails,
    getAllRejectSpaceList
}