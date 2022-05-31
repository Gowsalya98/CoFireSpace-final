const router=require('express').Router()
const userControllers=require('./user_controller');
const {validation}=require('../middleware/validation')

router.post('/register',userControllers.userRegister)

router.get('/verification/:encryptId',userControllers.verifyUsers)

router.post('/login',userControllers.login);

router.post('/forgetPassword',validation,userControllers.forgetPassword)

router.get('/getAll',userControllers.getAllUserList);

router.get('/get-user',userControllers.getSingleUser);

router.put('/update-user',userControllers.updateUserProfile)

router.delete('/delete-user',userControllers.deleteUserProfile)
 
//admin-user (all accepted space list view to user)

router.get('/getAll-acceptSpaceList',userControllers.getAllAcceptAndAvailableSpaceList)

module.exports=router;