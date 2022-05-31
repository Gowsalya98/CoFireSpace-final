const router=require('express').Router()

const spaceControl=require('./space_controller')

router.post('/addSpace',spaceControl.addSpaceForHost)

router.get('/ownSpaceList',spaceControl.hostGetOurOwnSpaceDetails)

router.get('/getById-space/:spaceId',spaceControl.getById)

router.put('/update-space/:spaceId',spaceControl.updateSpaceDetails)

router.delete('/delete-space/:spaceId',spaceControl.deleteSpaceDetails)


module.exports=router