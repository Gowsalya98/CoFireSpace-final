const router=require('express').Router()
const multer=require('../middleware/multer')
const spaceTypeControl=require('./category_controller')

router.post('/addSpaceType',spaceTypeControl.addSpaceType)

router.post('/image',multer.upload.single('image'),spaceTypeControl.spaceImage)

router.get('/getAll-spaceType',spaceTypeControl.getAllSpaceType)

router.get('/getById-spaceType/:spaceTypeId',spaceTypeControl.getById)

router.put('/update-spaceType/:spaceTypeId',spaceTypeControl.updateSpaceType)

router.delete('/delete-spaceType/:spaceTypeId',spaceTypeControl.deleteSpaceType)

module.exports=router