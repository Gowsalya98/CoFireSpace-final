const router=require('express').Router()

const approve=require('../superAdmin/adminApprovedSpace')

router.get('/getAll-space',approve.getAll)

router.get('/acceptSpace/:spaceId',approve.adminAcceptSpaceDetails)

router.get('/rejectSpace/:spaceId',approve.adminRejectSpaceDetails)

router.get('/getAll-RejectSpaceList',approve.getAllRejectSpaceList)

module.exports=router