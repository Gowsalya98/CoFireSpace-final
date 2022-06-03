const router=require('express').Router()
const filterControl=require('./spaceFilter_controller')

router.get('/uniqueSpace/:categoryName',filterControl.uniqueSpace)

router.post('/create-mostViewSpace',filterControl.createMostViewedSpace)

router.post('/create-popularSpaceLocation',filterControl.createPopularSpace)

router.get('/popularLocation',filterControl.popularSpaceLocation)

router.get('/mostViewedSpace',filterControl.mostViewedSpace)

module.exports=router