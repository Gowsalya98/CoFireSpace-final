const {spaceDetails,spaceImage}=require('./space_model')
const {register}=require('../user/user_model')
const {validationResult}=require('express-validator')
const mongoose=require('mongoose')
const jwt = require("jsonwebtoken");
const multer=require('multer')
const req = require('express/lib/request');
const moment=require('moment');


const addSpaceForHost=async(req,res)=>{
    try{
      console.log('line 8',req.body)
        if(req.headers.authorization){
            const token=await jwt.decode(req.headers.authorization)
            req.body.HostId=token.id
            console.log('line 13',req.body.HostId)
            const result=await register.aggregate([{$match:{$and:[{_id:new mongoose.Types.ObjectId(token.id)},{deleteFlag:false}]}}])
            if(result){
              console.log('line 16',result)
                req.body.HostDetails=result[0]
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                console.log('line 21',req.body.createdAt)
                const amount=req.body.price
                console.log('line 22',amount)
                const spaceTime=req.body.spaceTime
                console.log('line 24',spaceTime)
               // const noOfDays=req.body.noOfDays
                //calculateHourDayWeekMonth(amount,spaceTime,noOfDays);
            spaceDetails.create(req.body,(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed'})
                }else{
                    if(data!=null){
                      console.log('line 18',data)
                        res.status(200).send({success:'true',message:'create successfully',data})
                    }else{
                      res.status(302).send({success:'false',message:'failed',data:[]})
                    }
                }
            })
        }else{
            res.status(302).send({success:'false',message:'invalid id',data:[]})
        }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
      console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
function calculateHourDayWeekMonth(amount,spaceTime,noOfDays){

    if(spaceTime=="perHour"){
    const oneHour=noOfDays*24*amount/24
    console.log('line 52',oneHour)
    }else if(spaceTime=="perDay"){
      const oneDay=noOfDays*amount
      console.log('line 55',oneDay)
    }else if(spaceTime=="perWeek"){
      const oneWeek=noOfDays*7*24*amount
      console.log('line 58',oneWeek)
    }else if(spaceTime=="perYear"){
      const dateT = new Date().getFullYear();
      console.log(62);
      console.log(calculatingYear(dateT,noOfDays,100));
     
      // console.log((dateT/4).toString().includes("."));

      // if(dateT){
      //   const oneYear=noOfDays*24*amount*365
      //   console.log('line 61',oneYear)  
      // }
      // else{
      //   const oneYear=noOfDays*24*amount*366
      //   console.log('line 61',oneYear)  
      // }
      
    }else{
      console.log('something error')
    }
}

function calculatingYear(year,no,amount){
const yearArray = [];  
 let pass = 0;
  for(var i = 0 ; i< no ; i ++){
if(((year+i)/4).toString().includes(".")){
   yearArray.push(  amount * 365)

}else{
  yearArray.push( amount * 366)
}
  }
  console.log(yearArray);
pass = yearArray.reduce((total,num)=>total = total + num)

return pass;

}

const Image=async(req,res)=>{
  try{
    console.log(req.files)
    if(req.files.length==0){
      req.body.image=""
    }else{
      console.log('line 40',req.files)
      var arr=[]
      for(i=0;i<req.files.length;i++){
       const aa=`http://192.168.0.112:8080/uploads/${req.files[i].filename}`
        arr.push(aa)
      }
      console.log('line 49',arr)
      req.body.image=arr
      req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
        console.log('line 50',req.body.createdAt)
      spaceImage.create(req.body,async(err,data)=>{
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
const TotalSpace=async(req,res)=>{
  try{
    const superAdminToken=jwt.decode(req.headers.authorization)
      if(superAdminToken!=null){
        const data=await spaceDetails.aggregate([{$match:{deleteFlag:false}}])
        if(data.length!=null){
          const count=data.length
          res.status(200).send({success:'true',message:'Total Space',count})
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
const NewSpace=async(req,res)=>{
  try{
    const superAdminToken=jwt.decode(req.headers.authorization)
      if(superAdminToken!=null){
        const today=moment(new Date()).toISOString().slice(0,10)
        const data=await spaceDetails.aggregate([{$match:{$and:[{createdAt:today},{deleteFlag:false}]}}])
        if(data.length!=0){
          const count=data.length
          res.status(200).send({success:'true',message:'New Space',count})
        }else{
          res.status(400).send({success:'false',message:'data not found',data:[]})
        }
      }else{
        res.status(302).send({success:'false',message:'unauthorized'})
      }
  }catch(err){
    res.status(500).send({success:'false',message:'internal server error'})
  }
}
const getById=async(req,res)=>{
    try{
        if(req.params.spaceId.length==24){
            const data=await spaceDetails.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.spaceId)},{"deleteFlag":false}]}}])
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
const hostGetOurOwnSpaceDetails=async(req,res)=>{
  try{
    const token=jwt.decode(req.headers.authorization)
    if(token!=null){
      const data=await spaceDetails.aggregate([{$match:{$and:[{HostId:token.id},{deleteFlag:false}]}}])
      if(data){
        data.sort().reverse()
        res.status(200).send({success:true,message:'your own data',data:data})
      }else{
        res.status(302).send({success:'true',message:'failed',data:[]})
      }
    }else{
      res.status(400).send({success:'false',message:'invalid token'})
    }
  }catch(err){
    res.status(500).send({message:'internal server error'})
  }
}
const updateSpaceDetails=async(req,res)=>{
    try{
              if(req.headers.authorization){
                if (req.params.spaceId.length == 24) {
                const data = await spaceDetails.findOneAndUpdate({_id:req.params.spaceId,deleteFlag:false},{$set:req.body},{new:true})
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

const deleteSpaceDetails=async(req,res)=>{
    try{
      if(req.headers.authorization){
        if(req.params.spaceId.length==24){
            const data=await spaceDetails.findOneAndUpdate({_id:req.params.spaceId},{deleteFlag:true},{new:true})
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

module.exports={
  addSpaceForHost,
  Image,
  TotalSpace,
  NewSpace,
  getById,
  updateSpaceDetails,
  deleteSpaceDetails,
  hostGetOurOwnSpaceDetails
}