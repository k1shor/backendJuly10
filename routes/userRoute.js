const express = require('express')
const { addUser, confirmEmail } = require('../controllers/userController')
const router = express.Router()

router.post('/register', addUser)
router.get('/emailconfirmation/:token', confirmEmail)

module.exports = router
