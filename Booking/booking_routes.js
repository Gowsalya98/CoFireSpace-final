const router=require('express').Router()

const bookingControl=require('./booking_controller')

router.post('/userBooking/:spaceId',bookingControl.userReserveToSpace)

router.get('/userGetOurBookingHistory',bookingControl.userGetOurBookingHistory)

router.get('/current-BookingDetails',bookingControl.currentBookingDetails)

router.get('/past-BookingDetails',bookingControl.pastBookingDetails)

router.get('/getAll-booking',bookingControl.getAllBooking)

router.get('/getById-booking/:bookingId',bookingControl.getById)

module.exports=router