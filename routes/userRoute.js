const express = require('express')
const { addUser, confirmEmail, resendConfirmation, forgetpassword, resetPassword, signIn, userList, userDetails, findByEmail, updateUser, deleteUser } = require('../controllers/userController')
const { userRules, validation } = require('../validation')
const router = express.Router()

router.post('/register',userRules, validation, addUser)
router.get('/confirmuser/:token', confirmEmail)
router.post('/resendconfirmation',resendConfirmation)
router.post('/forgetpassword', forgetpassword)
router.post('/resetpassword/:token', resetPassword)
router.post('/signin', signIn)
router.get('/userlist', userList)
router.get('/userdetails/:id', userDetails)
router.post('/finduserbyemail',findByEmail)
router.put('/updateuser/:id',updateUser)
router.delete('/deleteuser/:id',deleteUser)

module.exports = router
