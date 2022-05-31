const router=require('express').Router()
const filterControl=require('./spaceFilter_controller')

router.get('/uniqueSpace/:categoryName',filterControl.uniqueSpace)

router.get('/popularLocation',filterControl.popularSpaceLocation)

router.get('/mostViewedSpace',filterControl.mostViewedSpace)

module.exports=router