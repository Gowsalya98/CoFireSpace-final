const {amenities}=require('./amenities_model')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')

const createAmenities=async(req,res)=>{
    try{
        const result=await amenities.countDocuments({amenitiesName:req.body.amenitiesName,deleteFlag:false})
        if(result==0){
        const token=jwt.decode(req.headers.authorization)
        req.body.adminId = token.id;
        console.log('line 12', req.body.adminId)
        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
          console.log('line 13',req.body.createdAt)
        const data=await amenities.create(req.body)
        if(data!=null){
            res.status(200).send({success:'true',message:'successfully add amenities details',data})
        }else{
            res.status(400).send({success:'false',message:'something wrong'})
        }
    }else{
        res.status(302).send({success:'false',message:'data already existed'})
    }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAll=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
        const data=await amenities.aggregate([{$match:{deleteFlag:false}}])
        console.log('line 25',data)
        if(data!=null){
            data.sort().reverse()
            console.log('....',data[0]._id)
            res.status(200).send({success:'true',message:'Amenities details',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed',data:[]})
        }
    }else{
        res.status(400).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getById=async(req,res)=>{
    try{
        if(req.params.amenitiesId.length==24){
           const data=await amenities.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.amenitiesId)},{deleteFlag:false}]}}])
           console.log('line 45',data)
           if(data.length!=0){
                console.log('line 46',data)
                res.status(200).send({success:'true',message:'your data',data:data[0]});
            } else {
              res.status(302).send({success:'false',message:'failed', data: [] });
            }
          } else {
            res.status(400).send({ message: "please provide a valid id" });
          }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const updateAmenities=async(req,res)=>{
    try{
        if(req.headers.authorization){
            if(req.params.amenitiesId.length==24){
                const datas=await amenities.findOne({_id:req.params.amenitiesId,deleteFlag:false})
                console.log('line 68',datas)
                if(datas!=null){
                    const data=await amenities.findOneAndUpdate({_id:req.params.amenitiesId},{$set:req.body},{new:true})
                    if(data!=null){
                        console.log('line 71',data)
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
const deleteAmenities=async(req,res)=>{
    try{
        if(req.headers.authorization){
            if(req.params.amenitiesId.length==24){
                const datas=await amenities.findOne({_id:req.params.amenitiesId,deleteFlag:false})
                if(datas!=null){
                    const data=await amenities.findOneAndUpdate({_id:req.params.amenitiesId},{deleteFlag:true},{new:true})
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
    createAmenities,getAll,getById,updateAmenities,deleteAmenities
}