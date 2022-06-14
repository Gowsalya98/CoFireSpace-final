const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const {rating}=require('./rating_model')
const { spaceDetails } = require('../addSpace/space_model')

const ratingForSpace=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            req.body.userId=userToken.id
            const data1=await rating.create(req.body)
            if(data1!=null){
                const data2=await rating.countDocuments({spaceId:data1.spaceId})
                if(data2!=null){
                    const numOfPerson=data2
                    const data3=await rating.aggregate([{$match:{spaceId:data1.spaceId}},{$project:{rating:1,_id:0}}])
                    if(data3!=null){
                        let rating=0;
                        for(i=0;i<data3.length;i++){
                            rating+=data3[i].rating
                        }
                        console.log('line 18',rating);
                        const average=rating/numOfPerson
                        console.log('line 20',average);
                        const data4 = Math.ceil(average)
                        console.log('line 22',data4)
                        const data5=await spaceDetails.findOneAndUpdate({_id:data1.spaceId},{$set:{rating:data4}},{new:true})
                        if(data5!=null){
                            console.log('line 26',data5);
                            res.status(200).send({message:'successfull',data5})
                        }else{
    
                        res.status(400).send({message:'failed'}) 
    
                        }
                    }else{
                        res.status(302).send({message:'data not found'})
                    }
                }else{
                    res.status(302).send({success:'false',message:'invalid spaceId'})
                }
            }else{
                res.status(302).send({success:'false',message:'does not add rating'})
            }
        }else{
            res.status(302).send({message:'unauthorized'})
        }
       
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

module.exports={ratingForSpace}