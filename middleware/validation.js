const { body, validationResult } = require('express-validator')

const validation = [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({ min: '5', max: '10' }).withMessage('Password must be 5 Character'),
    body('contact').isLength({min:'10', max:'10'}).withMessage('contact number must be valid')
]

const valid=[
    body('email').isEmail().withMessage('Email must be Valid'),
    body('phoneNumber').isLength({min:'10', max:'10'}).withMessage('phone Number number must be valid')
]

const superValid= [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({ min: '5', max: '10' }).withMessage('Password must be 5 Character')
]
module.exports = { validation,valid,superValid }