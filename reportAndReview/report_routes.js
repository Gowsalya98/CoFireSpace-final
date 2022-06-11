const router=require('express').Router()

const reportControll=require('./report_controller')

router.post('/create-report/:spaceId',reportControll.createReport)

router.get('/getAll-report',reportControll.getAll)

module.exports=router