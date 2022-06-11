const router=require('express').Router()

const spaceControl=require('./space_controller')

router.post('/addSpace',spaceControl.addSpaceForHost)

router.get('/ownSpaceList',spaceControl.hostGetOurOwnSpaceDetails)

router.get('/getById-space/:spaceId',spaceControl.getById)

router.put('/update-space/:spaceId',spaceControl.updateSpaceDetails)

router.delete('/delete-space/:spaceId',spaceControl.deleteSpaceDetails)

//space count 

router.get('/total-space',spaceControl.TotalSpace)

router.get('/new-space',spaceControl.NewSpace)

module.exports=router