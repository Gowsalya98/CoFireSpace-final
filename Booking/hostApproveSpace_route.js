const router=require('express').Router()

const approve=require('./hostApprovedSpace_control')

router.get('/hostGetOurSpaceBookingHistory',approve.hostGetOurSpaceBookingHistory)

router.get('/acceptBooking/:bookingId',approve.HostAcceptUserBooking)

router.get('/rejectBooking/:bookingId',approve.HostRejectUserBooking)

router.get('/getAll-acceptBooking',approve.getAllAcceptUserBooking)

router.get('/getAll-rejectBooking',approve.getAllRejectUserBooking)

module.exports=router