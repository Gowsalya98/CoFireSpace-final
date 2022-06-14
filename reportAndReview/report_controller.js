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
const getAllReport=async(req,res)=>{
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
const getByIdReport=async(req,res)=>{
    try{
        if(req.params.reportId.length==24){
            const data=await report.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.reportId)},{deleteFlag:false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'invalid report Id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const deleteReport=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            if(req.params.reportId.length==24){
                const datas=await report.findOne({_id:req.params.reportId,deleteFlag:false})
                console.log('line 156',datas)
                if(datas!=null){
                    const data=await report.findOneAndUpdate({_id:req.params.reportId},{$set:{deleteFlag:true}},{returnOriginal:false})
                    if(data!=null){
                        res.status(200).send({message:"Deleted successfully",data})
                    }else{
                        res.status(400).send({message:"failed to delete report "})
                    }
                }else{
                    res.status(302).send({message:"Data not found"})
                }
            }else{
                res.status(400).send({message:"Please provid the vaild id"})
            }
        }else{
            res.status(302).send({message:"Unauthorized"})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'}) 
    }
}
const createReview=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            const data1=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.id)},{deleteFlag:false}]}}])
            if(data1!=null){
                req.body.userId=data1[0]._id
                const data2=await spaceDetails.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.spaceId)},{deleteFlag:false}]}}])
                if(data2!=null){
                    req.body.spaceId=req.params.spaceId
                    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                    const data3=await review.create(req.body)
                    if(data3!=null){
                        res.status(200).send({success:'true',message:'review posted successfully',data:data3})
                        const data4=await spaceDetails.findOne({_id:data3.spaceId,deleteFlag:false})
                        if(data4!=null){
                            var arr=[]
                            data4.review.map((data5)=>{
                                arr.push(data5)
                            })
                            arr.push(req.body)
                            const data5=await spaceDetails.findOneAndUpdate({_id:data3.spaceId},{$set:{review:arr}},{new:true})
                            console.log('line 120',data5)
                        }else{
                            res.status(302).send({success:'false',message:'invalid space id'})
                        }
                    }else{
                        res.status(302).send({success:'false',message:'failed to post review'})
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
        res.status(500).send({message:'internal server error'})
    }
}

const getAllReview=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await review.aggregate([{$match:{deleteFlag:false}}])
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'All review list',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    createReport,
    getAllReport,
    getByIdReport,
    deleteReport,
    createReview,
    getAllReview
}