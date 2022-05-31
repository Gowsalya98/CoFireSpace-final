const router=require('express').Router()
const amenitiesControl=require('./amenities_controller')

router.post('/createAmenities',amenitiesControl.createAmenities)

router.get('/getAll-Amenities',amenitiesControl.getAll)

router.get('/getById-Amenities/:amenitiesId',amenitiesControl.getById)

router.put('/update-Amenities/:amenitiesId',amenitiesControl.updateAmenities)

router.delete('/delete-Amenities/:amenitiesId',amenitiesControl.deleteAmenities)

module.exports=router