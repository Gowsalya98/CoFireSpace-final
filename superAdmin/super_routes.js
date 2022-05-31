const router=require('express').Router()
const adminControl=require('./super_controller')

router.post('/addSubAdmin',adminControl.addSubAdmin)
router.post('/login',adminControl.login)

router.get('/getAll',adminControl.getAllSubAdminList)
router.get('/get-subadmin/:id',adminControl.getSingleSubAdmin)

router.put('/update-subadmin/:id',adminControl.updateSubAdminDetails)
router.delete('/delete-subadmin/:id',adminControl.deleteSubAdminDetails)

module.exports=router