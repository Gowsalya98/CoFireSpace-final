const router=require('express').Router()

const bookingControl=require('./booking_controller')

router.post('/userBooking/:spaceId',bookingControl.userReserveToSpace)

router.get('/userGetOurBookingHistory',bookingControl.userGetOurBookingHistory)

router.get('/current-bookingDetails',bookingControl.currentBookingDetails)

router.get('/past-bookingDetails',bookingControl.pastBookingDetails)

router.get('/getAll-booking',bookingControl.getAllBooking)

router.get('/getById-booking/:bookingId',bookingControl.getById)

//count for reservation details

router.get('/total-reserve',bookingControl.TotalReserve)

router.get('/new-reserve',bookingControl.NewReserve)

module.exports=router