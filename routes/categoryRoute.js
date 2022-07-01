const express = require('express')
const { addCategory } = require('../controllers/categoryController')
const router = express.Router()

router.post('/addcategory', addCategory)


module.exports = router