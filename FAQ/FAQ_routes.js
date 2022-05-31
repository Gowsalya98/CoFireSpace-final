const router=require('express').Router()
const FAQControl=require('./FAQ_controller')

router.post('/createFAQ',FAQControl.createFAQ)

router.get('/getAll-FAQ',FAQControl.getAll)

router.put('/update-FAQ/:id',FAQControl.updateFAQ)

router.delete('/delete-FAQ/:id',FAQControl.deleteFAQ)

module.exports=router