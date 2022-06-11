const router=require('express').Router()
const userControllers=require('./user_controller');
const userValidation=require('../middleware/validation')

router.post('/register',userValidation.valid,userControllers.userRegister)

router.get('/verification/:encryptId',userControllers.verifyUsers)

router.post('/login',userControllers.login);

router.post('/forgetPassword',userValidation.validation,userControllers.forgetPassword)

router.get('/getAll',userControllers.getAllUserList);

router.get('/get-user',userControllers.getSingleUser);

router.put('/update-user',userControllers.updateUserProfile)

router.delete('/delete-user',userControllers.deleteUserProfile)
 
//admin-user (all accepted space list view to user)

router.get('/getAll-acceptSpaceList',userControllers.getAllAcceptAndAvailableSpaceList)

//count for user

router.get('/total-user',userControllers.TotalUser)

router.get('/new-user',userControllers.NewUser)

module.exports=router;