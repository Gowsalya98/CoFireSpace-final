const mongoose=require('mongoose')
const {spaceDetails}=require('../addSpace/space_model')

const uniqueSpace=async(req,res)=>{
    try{
        const data=await spaceDetails.aggregate([{$match:{$and:[{categoryName:req.params.categoryName},{deleteFlag:false},{status:'accept'}]}}])
        if(data!=null){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'unique space',data:data})
        }else{
            res.status(302).send({success:'false',message:'data not found',data:[]})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}

const popularSpaceLocation=async(req,res)=>{
    try{
      const data=await spaceDetails.aggregate([{$match:{deleteFlag:false}},{$sort:{count:-1}}])
      if(data){
        res.status(200).send({success:'true',message:'popular space location',data:data})
      }else{
        res.status(302).send({success:'false',message:'data not found',data:[]})
      }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const mostViewedSpace=async(req,res)=>{
    try{
        const data=await spaceDetails.aggregate([{$match:{deleteFlag:false}},{$sort:{count:-1}}])
        if(data){
          res.status(200).send({success:'true',message:'Most viewed space',data:data})
        }else{
          res.status(302).send({success:'false',message:'data not found',data:[]})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={uniqueSpace,popularSpaceLocation,mostViewedSpace}