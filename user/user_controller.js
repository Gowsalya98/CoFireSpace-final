const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const fast2sms=require('fast-two-sms')
const nodemailer=require('nodemailer')
const moment=require('moment')
const {validationResult}=require('express-validator')
const {randomString}=require('../middleware/randomString')
const {spaceDetails}=require('../addSpace/space_model')
const{register,sendOtp}=require('./user_model')

const userRegister= async(req, res) => {
    try {
        const errors =validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).send({errors:errors.array()})
            }else{
            const num= await register.aggregate([{$match:{ email: req.body.email }}])
                if (num.length== 0) {
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                    console.log('line 22',req.body.createdAt)
                    register.create(req.body, (err, data) => {
                        if (data) {
                            const encryptId=jwt.sign({id:data._id},'who are you')
                            console.log('......',encryptId)
                            //postMail(data.email,'verification',`http://192.168.0.112:8080/users/verification/${encryptId}`)
                            console.log('line 28',data)
                            res.status(200).send({ success:'true',message: 'Successfully register and verification send your email', data})    
                        } else {
                             res.staus(400).send({ success:'false',message: 'failed to register data' })
                        }
                   })
                } else {
                    res.status(400).send({success:'false',message:'your email already exists,please try another'})
                }
            }
    } catch (err) {
        console.log('line 28',err.message)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

  const verifyUsers =async (req,res)=>{
    try{
      const decryptId=jwt.decode(req.params.encryptId)
      console.log('line 45',decryptId)
      const id=decryptId.id
      console.log('line 47',id)
      const data=await register.findByIdAndUpdate(id,{active:true},{new:true})
      res.send('verification successfullly')
  
    }catch(err){ 
      res.status(500).send({message:err.message})
    }
  }

const login = async(req, res) => {
    try {
            const data=await register.findOne({ email: req.body.email,deleteFlag:false,active:true})
            console.log(data);
            if (data!=null) {
                    console.log('line 84',data)
                     const password=await bcrypt.compare(req.body.password,data.password)
                if(password==true){
                        console.log('line 87',password)
                        const token = (jwt.sign({id:data._id}, 'secretKey'))
                        res.status(200).send({ success:'true',message: "Login Successfully", token, data:data })
                } else {
                    res.status(200).send({ success:'false',message: "password mismatch",data:[]})
                }
            }else{res.status(400).send({ success:'false',message: "please register here",data:[]})}
    } catch (err) {
        console.log(err)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const forgetPassword=(req,res)=>{
    try{
        if (req.body.otp != null) {
            sendOtp.findOne({ otp: req.body.otp }, async (err, result) => {
                console.log("line 89", result)
                if (result) {
                    // const token = jwt.decode(req.headers.authorization)
                    // const userid = token.id
                    register.findOne({email:req.body.email,deleteFlag:'false' }, async (err, data) => {
                        console.log("line 94", data)
                        if (data) {
                            if (req.body.email == data.email||req.body.contact==data.contact) {
                                console.log("line 97", req.body.email)
                                console.log("line 98", data.email)

                                if (req.body.newPassword == req.body.confirmPassword) {
                                    console.log("line 101", req.body.newPassword)
                                    console.log("line 102", req.body.confirmPassword)

                                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
                                    register.findOneAndUpdate({email:req.body.email }, { $set:{password: req.body.newPassword} },{new:true}, (err, datas) => {
                                        if (err) { throw err }
                                        else {
                                            console.log('line 108',datas);
                                            res.status(200).send({ message: "Reset Password Successfully", datas })
                                        }
                                    })
                                } else { res.status(400).send({ message: 'password does not match' }) }
                            } else { res.status(400).send({ message: 'email does not match ' }) }
                        }
                    })
                } else { res.status(400).send({ message: 'invalid otp' }) }
            })
        } else {
            // const token = jwt.decode(req.headers.authorization)
            // const userid = token.id
            register.findOne({ email:req.body.email,deleteFlag:'false'},(err,data) => {
                console.log("line 122", data)
                if (data) {
                    console.log('line 124',data.email);
                    console.log('line 125',data.contact);
                    if (req.body.email == data.email && req.body.contact == data.contact) {
                        const otp = randomString(3)
                        console.log("otp", otp)
                        req.body.userDetails=data
                       sendOtp.create({ otp: otp,userDetails:req.body.userDetails},async(err, result) => {
                            console.log("line 131", result)
                            if (err) { throw err }
                            if (result) {
                                console.log("line 134", result)
                                //postMail(req.body.email, 'otp for changing password', otp)
                                console.log('line 136', otp)

                                const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[data.PhoneNumber]})

                                res.status(200).send({ message: "verification otp send your email and your mobile number",result})
                                setTimeout(() => {
                                    sendOtp.findOneAndDelete({ otp: otp }, (err, datas) => {
                                        console.log("line 143", datas)
                                        if (err) { throw err }
                                    })
                                }, 200000)
                            }
                        })
                    } else { res.status(400).send({ message: 'email and contact does not match' }) }
                } else { res.status(400).send({ message: 'invalid token' }) }
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nishagowsalya339@gmail.com',
        pass: '8760167075'
    }
  })
  
  const postMail = function ( to, subject, text) {
    return transport.sendMail({
        from: 'nishagowsalya339@gmail.com',
        to: to,
        subject: subject,
        text: text
    })
  }
const getAllUserList = async(req, res) => {
    try {
        const token=jwt.decode(req.headers.authorization)
        if(token!==null){
        const data=await register.aggregate([{$match:{deleteFlag:false}}])
        console.log('line 172',data)
        if(data.length!=0){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All datas',data:data})
        }else{
            res.status(302).send({success:'false',message:'data not found',data:[]})
        }
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
    } catch (err) {
        console.log(err)
        res.status(500).send({message:"internal server error"})
    }
}
const TotalUser=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await register.aggregate([{$match:{deleteFlag:false}}])
            if(data.length!=0){
                const count=data.length
                res.status(200).send({success:'true',message:'Total User',count})
            }else{
                res.status(400).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const NewUser=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await register.aggregate([{$match:{deleteFlag:false}}])
            const today=moment(new Date()).toISOString().slice(0,10)
            var arr=[]
            data.map((datas)=>{
                if(today==datas.createdAt){
                    arr.push(datas)
                }   
            })
            const count=arr.length
            res.status(200).send({success:'true',message:'New User',count})
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const getSingleUser = async(req, res) => {
    try {
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
            const data=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(token.id)},{'deleteFlag':false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data',data:data[0]})
            }else{
                res.status(302).send({success:'false',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
    } catch (err) {
        res.status(500).send({message:"internal server error"})
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
                const data=await register.findByIdAndUpdate({_id:token.id},{$set:req.body},{ new: true})
                if (data) {
                    res.status(200).send({ success:'true',message: 'updated successfully',data:data })
                } else {
                    res.status(302).send({success:'false',data:[]})
                }
        }else{ res.status(400).send({ message: "unauthorized" })}
    } catch (err) {
        res.status(500).send({message:"internal server error"})
    }
}

const deleteUserProfile = async (req, res) => {
    try {
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
                const data=await register.findOneAndUpdate({ _id:token.id }, { $set: { deleteFlag:true } }, { returnOriginal: false })
                if(data!=null){
                    res.status(200).send({ success:'true',message: "Delete Data Successfully",data:data })
                } else { 
                    res.status(302).send({success:'false',data:[]})
                }
    }else{
        res.status(400).send({ message: "unauthorized" })
    }
    } catch (err) { res.status(500).send({ message: "internal server error" }) }
}
const getAllAcceptAndAvailableSpaceList=async(req,res)=>{
    try{
        const data=await spaceDetails.aggregate([{$match:{$and:[{"status":"accept"},{"spaceBookingStatus":"availableSpace"},{deleteFlag:false}]}}])
        if(data){
            data.sort().reverse()
            res.status(200).send({message:'All accept space list',data:data})
        }else{
            res.status(302).send({message:'data is empty',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    userRegister,
    login,
    forgetPassword,
    getAllUserList,
    TotalUser,
    NewUser,
    getSingleUser,
    updateUserProfile,
    deleteUserProfile,
    verifyUsers,
    getAllAcceptAndAvailableSpaceList
}