const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const {FAQ}=require('./FAQ_model')

const createFAQ=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
        const data=await FAQ.create(req.body)
        if(data!=null){
            res.status(200).send({success:'true',message:'successfull',data:data})
        }else{
            res.status(302).send({success:'false',message:'failed',data:[]})
        }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAll=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
        const data=await FAQ.aggregate([{$match:{deleteFlag:false}}])
        if(data.length!=0){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All FAQ',data:data})
        }else{
            res.status(302).send({success:'false',message:'failed',data:[]}) 
        }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'}) 
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const updateFAQ=async(req,res)=>{
    try{
    if(req.headers.authorization){
        if(req.params.id.length==24){
            const datas=await FAQ.findOne({_id:req.params.id,deleteFlag:false})
            console.log('line 44',datas)
            if(datas!=null){
                const data=await FAQ.findOneAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
                if(data!=null){
                    console.log('line 48',data)
                    res.status(200).send({success:'true',message:'update successfull',data:data})
                }
            }else{
                res.status(400).send({success:'true',message:'something wrong try it again',data:[]})
            }
        }else{
            res.status(302).send({message:'please provide valid id'})
        }
    }else{
        res.status(302).send({message:'unauthorized'})
    }
}catch(err){
    res.status(500).send({message:'internal server error'})
}
}
const deleteFAQ=async(req,res)=>{
    try{
        if(req.headers.authorization){
            if(req.params.id.length==24){
                const datas=await FAQ.findOne({_id:req.params.id,deleteFlag:false})
                if(datas!=null){
                    const data=await FAQ.findOneAndUpdate({_id:req.params.id},{deleteFlag:true},{new:true})
                    if(data!=null){
                        res.status(200).send({success:'true',message:'delete successfull',data:data})
                    }
                }else{
                    res.status(400).send({success:'true',message:'something wrong try it again',data:[]})
                }
            }else{
                res.status(302).send({message:'please provide valid id'})
            }
        }else{
            res.status(302).send({message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    createFAQ,getAll,updateFAQ,deleteFAQ
}