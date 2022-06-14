const router=require('express').Router()

const reportControll=require('./report_controller')

//report for space

router.post('/create-report/:spaceId',reportControll.createReport)

router.get('/getAll-report',reportControll.getAllReport)

router.get('/getById-report/:reportId',reportControll.getByIdReport)

router.delete('/delete-report/:reportId',reportControll.deleteReport)

//review for space

router.post('/create-review/:spaceId',reportControll.createReview)

router.get('/getAll-review',reportControll.getAllReview)

module.exports=router