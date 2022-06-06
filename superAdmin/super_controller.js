const jwt = require("jsonwebtoken");
const bcrypt=require('bcrypt')
const {validationResult}=require('express-validator')
const mongoose=require('mongoose')
const moment=require('moment')
const {superAdmin}=require('./super_model')

const login=async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
        const data=await superAdmin.findOne({ email: req.body.email},{deleteFlag:false})
            if (data) {
                console.log('line 11',data)
                 const password=await bcrypt.compare(req.body.password,data.password)
                 console.log('line 13',password);
                if(password==true){
                    console.log('line 14',password)
                const token = (jwt.sign({id:data._id}, 'secretKey'))
                console.log('line 16',data)
                res.status(200).send({ success:'true',message: "Login Successfully", token, data:data })
            } else {
                res.status(200).send({ success:'false',message: "invaild password",data:[]})
            }
    }else{res.status(400).send({ success:'false',message: "data not exist",data:[]})}
}
} catch (err) {
    console.log(err)
    res.status(500).send({success:'false',message:'internal server error'})
}
}

const addSubAdmin=async(req,res)=>{
        try {
            const errors=validationResult(req)
        if(!errors.isEmpty()){
            res.json({message:errors.array()})
        }else{
            if(req.headers.authorization){
                const token=await jwt.decode(req.headers.authorization)
                console.log('line 35',token)
                req.body.adminId=token.id
                console.log('line 37',token.id)
               req.body.password=await bcrypt.hash(req.body.password,10)
               req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                console.log('line 43',req.body.createdAt)
                superAdmin.create(req.body,(err,data)=>{
                    if(err){
                        res.status(400).send({success:'false',message:'failed'})
                    }else{
                        if(data!=null){
                          console.log(data)
                            res.status(200).send({success:'true',message:'add admin successfully',data})
                        }else{
                          res.status(200).send({success:'false',message:'failed',data:[]})
                        }
                    }
                })
                }else{
                    res.status(200).send({success:'false',message:'unauthorized'})
                }
        }
        } catch (err) {
            console.log(err)
            res.status(500).send({ message: 'internal server error' })
        }
}
const getAllSubAdminList=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!==null){
           const data=await superAdmin.aggregate([{$match:{$and:[{"role":"subadmin"},{deleteFlag:false},{"adminId":superAdminToken.id}]}}])
           if(data){
               data.sort().reverse()
               res.status(200).send({success:'true',message:'All Sub Admin datas',data})
           }else{
            res.status(302).send({success:'false',message:'failed',data:[]})
           }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
    }catch(err){

    }
}

const getSingleSubAdmin= async (req, res) => {
    try {
        const token=jwt.decode(req.headers.authorization)
            if(token!==null){
        if(req.params.id.length==24){
            const data=await superAdmin.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.id)},{"deleteFlag":false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data' ,data:data[0] });
            } else {
              res.status(302).send({success:'false',message:'failed', data: [] });
            }
          } else {
            res.status(400).send({ message: "please provide a valid id" });
          }
        }else{
            res.status(400).send({ message: "unauthorized" });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message:"internal server error" })
    }
}

const updateSubAdminDetails=async(req,res)=>{
    try{
        console.log('line 104',req.body)
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=undefined){
          if (req.params.id.length == 24) {
              console.log('line 108',req.params.id);
              if(!req.body.password){
          let datas = await superAdmin.findByIdAndUpdate({_id:req.params.id,deleteFlag:false},{$set:req.body},{new:true})
            if (datas) {
                console.log('line 109',datas)
                  res.status(200).send({ success:'true',message:'upadate successfully',data: datas });
              }else{
                res.status(400).send({ success:'false',message:'failed',data: [] });
              }  
            }else{
               req.body.password=await bcrypt.hash(req.body.password,10)
          let datas = await superAdmin.findByIdAndUpdate({_id:req.params.id,deleteFlag:false},{$set:req.body},{new:true})
          if (datas) {
              console.log('line 109',datas)
                res.status(200).send({ success:'true',message:'upadate successfully',data: datas });
            }else{
              res.status(400).send({ success:'false',message:'failed',data: [] });
            }    
            }     
          } else {
            res.status(302).send({ message: "please provide a valid id" });
          }
        }else{
          res.status(400).send({ message: "unauthorized" });
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal error error'})
    }
}

const deleteSubAdminDetails=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=undefined){
          if (req.params.id.length == 24) {
          let datas = await superAdmin.findByIdAndUpdate({_id:req.params.id},{deleteFlag:true},{new:true})
            if (datas) {
                  res.status(200).send({ success:'true',message:'delete successfully',data: datas });
              }else{
                res.status(400).send({ success:'false',message:'failed',data: [] });
              }       
          } else {
            res.status(302).send({ message: "please provide a valid id" });
          }
        }else{
          res.status(400).send({ message: "unauthorized" });
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal error error'})
    }
}
module.exports={
    login,addSubAdmin,getAllSubAdminList,getSingleSubAdmin,updateSubAdminDetails,deleteSubAdminDetails
}