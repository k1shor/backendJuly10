const express = require('express')
const { demoFunction } = require('../controllers/demoController')
const router = express.Router()

router.get('/hello',(request, response)=>{
    response.send(" hello this is router.")
})

router.get('/welcome', demoFunction)

module.exports = router