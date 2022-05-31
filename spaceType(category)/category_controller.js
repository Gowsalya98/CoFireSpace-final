const {image,spaceType}=require('./category_model')
const {validationResult}=require('express-validator')
const mongoose=require('mongoose')
const moment=require('moment')
const jwt = require("jsonwebtoken");

const addSpaceType=async(req,res)=>{
    try{
      console.log('line 8',req.body)
        if(req.headers.authorization){
            const token=await jwt.decode(req.headers.authorization)
            req.body.superAdminId=token.id
            console.log('line 12',req.body.superAdminId)
            req.body.createdAt=moment(new Date()).toISOString().slice(0,9)
                console.log('line 14',req.body.createdAt)
            spaceType.create(req.body,(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed'})
                }else{
                    if(data!=null){
                      console.log('line 19',data)
                        res.status(200).send({success:'true',message:'create successfully',data})
                    }else{
                      res.status(302).send({success:'false',message:'failed',data:[]})
                    }
                }
            })
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const spaceImage=async(req,res)=>{
    try{
      if(req.file.originalname==null||undefined){
        req.body.image=""
      }else{
        console.log('line',req.file)
        req.body.image=`http://192.168.0.112:8080/uploads/${req.file.originalname}`
        req.body.createdAt=moment(new Date()).toISOString().slice(0,9)
          console.log('line 43',req.body.createdAt)
        image.create(req.body,async(err,data)=>{
          if(err){
            res.status(400).send({success:'false',message:'failed'})
          }else{
            console.log('line',data)
            res.status(200).send({success:'true',message:'image upload successfully',data})
          }
        })
      }
      
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getAllSpaceType=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
       const data=await spaceType.aggregate([{$match:{deleteFlag:false}}])
       if(data){
            data.sort().reverse()
            res.status(200).send({Success:'true',message:'All Space Type',data})
       }else{
        res.status(400).send({uccess:'false',message:'failed',data:[]})
       }
    }else{
        res.status(400).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        
    }
}
const getById=async(req,res)=>{
    try{
        if(req.params.spaceTypeId.length==24){
            const data=await spaceType.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.spaceTypeId)},{"deleteFlag":false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data' ,data: data[0] });
            } else {
              res.status(302).send({success:'false',message:'failed', data: [] });
            }
          } else {
            res.status(400).send({ message: "please provide a valid id" });
          }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const updateSpaceType=async(req,res)=>{
    try{
              if(req.headers.authorization){
                if (req.params.spaceTypeId.length == 24) {
                const data = await spaceType.findOneAndUpdate({_id:req.params.spaceTypeId,deleteFlag:false},{$set:req.body},{new:true})
                  if (data!=null) {
                    const token=await jwt.decode(req.headers.authorization)
                    if(token){
                        res.status(200).send({ success:'true',message:'upadate successfully',data: data });
                    }else{
                      res.status(200).send({ success:'false',message:'invalid token ',data: [] });
                    }       
                  } else {
                    res.status(302).send({ success:'false',data: [] });
                  }
                } else {
                  res.status(200).send({ message: "please provide a valid space id" });
                }
              }else{
                res.status(400).send({ message: "unauthorized" });
              }
            }catch(err){
                console.log(err);
              res.status(500).send("internal server error")
            }
          }

const deleteSpaceType=async(req,res)=>{
    try{
      if(req.headers.authorization){
        if(req.params.spaceTypeId.length==24){
            const data=await spaceType.findOneAndUpdate({_id:req.params.spaceTypeId},{deleteFlag:true},{new:true})
            if(data!=null){
                res.status(200).send({success:'true',message:'delete successfully',data})
            }else{
                res.status(400).send({success:'false', message:'something wrong please try it again'})
            }
        }else{
            res.status(400).send({success:'false',message:'please provide valid id'})
        }
      }else{
        res.status(400).send({success:'false',message:"unauthorized"})
      }
    }catch(err){
      console.log(err);
        res.status(500).send({message:'internal server error'})
    }
}

module.exports={addSpaceType,getAllSpaceType,getById,spaceImage,updateSpaceType,deleteSpaceType}