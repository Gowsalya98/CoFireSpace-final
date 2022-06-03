const mongoose=require('mongoose')
const moment=require('moment')
const {spaceDetails}=require('../addSpace/space_model')
const {filter}=require('./Filter_model')

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
const createPopularSpace=(req,res)=>{
  try{
    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
    filter.create(req.body,async(err,data1)=>{
      if(data1){
         const data2=await spaceDetails.findById(req.body.spaceId,{deleteFlag:false})
            if(data2){
              data2.userIpAddress.push(req.body.userIpAddress)
              const data=await spaceDetails.findByIdAndUpdate(req.body.spaceId,data2,{new:true})
              if(data){
                  res.status(200).send({success:'true',message:'successfully created popular space',data})
                }else{res.status(400).send({success:'false',message:'failed'})}
            }else{
              res.status(302).send({success:'true',message:'invalid space id'})
              }
      }else{
        res.status(302).send({success:'false',message:'failed to create'})
      }
    })
  }catch(err){
    res.status(500).send({message:'internal server error'})
  }
}
const popularSpaceLocation=async(req,res)=>{
    try{
            
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const createMostViewedSpace=async(req,res)=>{
  try{
    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
    filter.create(req.body,async(err,data1)=>{
      if(data1){
         const data2=await spaceDetails.findById(req.body.spaceId,{deleteFlag:false})
            if(data2){
              data2.userIpAddress.push(req.body.userIpAddress)
              const data=await spaceDetails.findByIdAndUpdate(req.body.spaceId,data2,{new:true})
              if(data){
                console.log("....",data)
                const ipAddressCount=data.userIpAddress.length
                console.log("....",ipAddressCount)
                  const datas=await spaceDetails.findByIdAndUpdate(req.body.spaceId,{$set:{ipAddressCount:ipAddressCount}},{new:true})
                    if(datas){
                        res.status(200).send({success:'true',message:'successfully created most view space',datas})
                    }else{res.status(400).send({success:'false',message:'failed'})}
                  }
            }else{
              res.status(302).send({success:'true',message:'invalid space id'})
              }
      }else{
        res.status(302).send({success:'false',message:'failed to create'})
      }
    })
  }catch(err){
    res.status(500).send({message:'internal server error'})
  }
}
const mostViewedSpace=async(req,res)=>{
    try{
        const data=await spaceDetails.aggregate([{$match:{deleteFlag:false}},{$sort:{ipAddressCount:-1}}])
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
module.exports={
  uniqueSpace,
  createPopularSpace,
  popularSpaceLocation,
  createMostViewedSpace,
  mostViewedSpace
}