const router=require('express').Router()
const adminControl=require('./super_controller')
const valid=require('../middleware/validation')

router.post('/addSubAdmin',valid.superValid,adminControl.addSubAdmin)
router.post('/login',valid.superValid,adminControl.login)

router.get('/getAll',adminControl.getAllSubAdminList)
router.get('/get-subadmin/:id',adminControl.getSingleSubAdmin)

router.put('/update-subadmin/:id',adminControl.updateSubAdminDetails)
router.delete('/delete-subadmin/:id',adminControl.deleteSubAdminDetails)

module.exports=router