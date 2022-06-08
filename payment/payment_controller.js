const jwt=require('jsonwebtoken')
const moment=require('moment')
const {payment}=require('./payment_model')

const createOrderId=(req,res)=>{
    try{

    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

module.exports={createOrderId}