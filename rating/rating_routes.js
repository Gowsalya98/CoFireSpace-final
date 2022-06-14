const router=require('express').Router()

const ratingControl=require('./rating_controller')

router.post('/rating',ratingControl.ratingForSpace)


module.exports=router