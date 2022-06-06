const router=require('express').Router()

const approve=require('./hostApprovedSpace_control')

router.get('/hostGetOurSpaceBookingHistory',approve.hostGetOurSpaceBookingHistory)

router.get('/acceptBooking/:bookingId',approve.HostAcceptUserBooking)

router.get('/rejectBooking/:bookingId',approve.HostRejectUserBooking)

router.get('/getAll-acceptBooking',approve.getAllAcceptUserBooking)

router.get('/getAll-rejectBooking',approve.getAllRejectUserBooking)

//filter for booking
router.get('/past-bookingDetails',approve.pastBookingDetails)

router.get('/upcoming-bookingDetails',approve.upcomingBookingDetails)

router.get('/pending-bookingDetails',approve.pendingBookingDetails)

router.get('/confirm-bookingDetails',approve.confirmedBooking)

module.exports=router