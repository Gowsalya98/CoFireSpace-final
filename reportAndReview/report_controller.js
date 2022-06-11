const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const {report,review}=require('./report_model')
const {spaceDetails}=require('../addSpace/space_model')
const {register}=require('../user/user_model')

const createReport=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
            if(userToken!=null){
                const data=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.id)},{deleteFlag:false}]}}])
                if(data!=null){
                    req.body.userDetails=data
                    const result=await spaceDetails.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.spaceId)},{deleteFlag:false}]}}])
                    if(result!=null){
                        req.body.spaceDetails=result
                        const datas=await report.create(req.body)
                        if(datas!=null){
                            res.status(200).send({success:'true',message:'your report send successfully',data:datas})
                        }else{
                            res.status(400).send({success:'false',message:'failed to report this product'})
                        }
                    }else{
                        res.status(302).send({success:'false',message:'invalid space id'})
                    }
                }else{
                    res.status(302).send({success:'false',message:'data not found'})
                }
            }else{
                res.status(302).send({success:'false',message:'unauthorized'})
            }
    }catch(err){
        res.status(500).send({Message:'internal server error'})
    }
}
const getAll=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await report.aggregate([{$match:{deleteFlag:false}}])
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'All report list',data:data})
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
    createReport,getAll
}