const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const errorThrower = require('./errorHandler/error_thrower')
const appError = require('./errorHandler/common_error_handler')
require('./config/db_config')
const app = express()

const user=require('./user/user_routes')
const superAdmin=require('./superAdmin/super_routes')
const category=require('./spaceType(category)/category_routes')
const amenities=require('./Amenities/amenities_routes')
const FAQ=require('./FAQ/FAQ_routes')
const space = require('./addSpace/space_routes')
const acceptSpaceForAdmin=require('./superAdmin/admin_routes')
const filter=require('./FilterSpace/Filter_routes')
const booking=require('./Booking/booking_routes')
const acceptBookingForhost=require('./Booking/hostApproveSpace_route')
const payment=require('./payment/payment_routes')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static('uploads'))

app.use('/users', user,filter,booking,payment)
app.use('/admin',superAdmin,category,amenities,FAQ,acceptSpaceForAdmin)
app.use('/host',space,acceptBookingForhost)

app.get('/',(req,res)=>{
    res.send('welcome FireKey')
})

app.listen(process.env.PORT, () => {
    console.log("port running on ", process.env.PORT)
})

